<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Image;
use App\Models\Product;
use App\Models\Category;
use App\Models\Discount;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\OrderDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;


class ProductController extends Controller
{
  
    
    public function index(Request $request)
    {
        try {
            $sortOption = $request->query('sort', 'all');
            $page = $request->query('page', 1);
            $selectedCategories = json_decode($request->query('selectedCategories', '[]'));
            $selectedBrands = json_decode($request->query('selectedBrands', '[]'));
            $priceRange = json_decode($request->query('priceRange', '{"min":0,"max":1000}'), true);
    
            $cacheKey = "products_{$page}_{$sortOption}_" . md5(implode('_', $selectedCategories) . "_" . implode('_', $selectedBrands) . "_{$priceRange['min']}_{$priceRange['max']}");
    
            $products = Cache::remember($cacheKey, 600, function() use ($sortOption, $page, $selectedCategories, $selectedBrands, $priceRange) {
                $query = Product::with('images', 'category', 'discounts', 'brand');
    
                if (!empty($selectedCategories)) {
                    $query->whereHas('category', function($q) use ($selectedCategories) {
                        $q->whereIn('name', $selectedCategories);
                    });
                }
    
                if (!empty($selectedBrands)) {
                    $query->whereHas('brand', function($q) use ($selectedBrands) {
                        $q->whereIn('name', $selectedBrands);
                    });
                }
    
                if ($priceRange) {
                    $query->whereBetween('price', [$priceRange['min'], $priceRange['max']]);
                }
    
                switch ($sortOption) {
                    case 'price_asc':
                        $query->orderBy('price', 'asc');
                        break;
                    case 'price_desc':
                        $query->orderBy('price', 'desc');
                        break;
                    case 'new':
                        $query->orderBy('created_at', 'desc');
                        break;
                    case 'all':
                    default:
                        break;
                }
    
                return $query->paginate(9, ['*'], 'page', $page);
            });
    
            $products->getCollection()->transform(function ($product) {
                $productDiscount = $product->currentDiscount();
    
                if ($productDiscount) {
                    $product->is_discounted = true;
                    if ($productDiscount->discount_type === 'percentage') {
                        $product->discounted_price = $product->price * (1 - $productDiscount->discount_value / 100);
                    } else {
                        $product->discounted_price = $product->price - $productDiscount->discount_value;
                    }
                    $product->discount_name = $productDiscount->name;
                    $product->discount_code = $productDiscount->code;
                } else {
                    $product->is_discounted = false;
                }
    
                return $product;
            });
    
            return response()->json($products);
    
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server Error'], 500);
        }
    }
    
    public function category()
    {
        $category = Category::has('products')->get();
        return response()->json($category);
    }

    public function brand()
    {
        $brand = Brand::has('products')->get();
        return response()->json($brand);
    }

    public function bestSellingProduct()
    {
        try {
            $bestsellingPrd = OrderDetail::bestSellingProduct();

            $bestsellingPrd->transform(function ($product) {
                $productDiscount = $product->currentDiscount();

                if ($productDiscount) {
                    $product->is_discounted = true;
                    if ($productDiscount->discount_type === 'percentage') {
                        $product->discounted_price = $product->price * (1 - $productDiscount->discount_value / 100);
                    } else {
                        $product->discounted_price = $product->price - $productDiscount->discount_value;
                    }
                    $product->discount_name = $productDiscount->name;
                    $product->discount_code = $productDiscount->code;
                } else {
                    $product->is_discounted = false;
                }
                
                return $product;
            });

            return response()->json($bestsellingPrd);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server Error'], 500);
        }
    }

    public function priceAscending()
    {
        // Assuming priceAscending and priceDescending should return products sorted by price
        $products = Product::with(['images', 'category', 'brand'])
                            ->orderBy('price', 'asc')
                            ->get();

        return response()->json($products);
    }

    public function priceDescending()
    {
        $products = Product::with(['images', 'category', 'brand'])
                            ->orderBy('price', 'desc')
                            ->get();

        return response()->json($products);
    }

    public function selectProductBestRating()
    {
        $products = Product::with(['images', 'category', 'brand'])
                            ->withAvgRating()
                            ->orderByDesc('avg_rating')
                            ->get();

        return response()->json($products);
    }

    public function search(Request $request)
{
    try {
        $key = $request->searchKey;

        // Generate a unique cache key based on the search key
        $cacheKey = "search_{$key}";

        // Check if the results are already cached
        $products = Cache::remember($cacheKey, 600, function() use ($key) {
            return Product::with(['images', 'category', 'discounts', 'brand'])
                         ->search($key)
                            ->get();
        });

        $products->transform(function ($product) {
            $productDiscount = $product->currentDiscount();

            if ($productDiscount) {
                $product->is_discounted = true;
                if ($productDiscount->discount_type === 'percentage') {
                    $product->discounted_price = $product->price * (1 - $productDiscount->discount_value / 100);
                } else {
                    $product->discounted_price = $product->price - $productDiscount->discount_value;
                }
                $product->discount_name = $productDiscount->name;
                $product->discount_code = $productDiscount->code;
            } else {
                $product->is_discounted = false;
            }

            return $product;
        });

        return response()->json($products);

    } catch (\Exception $exception) {
        return response(['message' => $exception->getMessage()], 400);
    }
}



    public function show($id)
    {
        try {
            $product = Product::with('images', 'category', 'brand')->find($id);

            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }

            $relatedByCategory = Product::where('category_id', $product->category_id)
                                        ->where('id', '!=', $product->id)
                                        ->with(['images', 'category', 'brand'])
                                        ->limit(5)
                                        ->get();

            $relatedByBrand = Product::where('brand_id', $product->brand_id)
                                     ->where('id', '!=', $product->id)
                                     ->with(['images', 'category', 'brand'])
                                     ->limit(5)
                                     ->get();

            $currentDiscount = $product->currentDiscount();

            if ($currentDiscount) {
                $product->is_discounted = true;
                if ($currentDiscount->discount_type === 'percentage') {
                    $product->discounted_price = $product->price * (1 - $currentDiscount->discount_value / 100);
                } else {
                    $product->discounted_price = $product->price - $currentDiscount->discount_value;
                }
                $product->discount_name = $currentDiscount->name;
                $product->discount_code = $currentDiscount->code;
            } else {
                $product->is_discounted = false;
            }

            return response()->json([
                'product' => $product,
                'relatedByCategory' => $relatedByCategory,
                'relatedByBrand' => $relatedByBrand
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
  
}
