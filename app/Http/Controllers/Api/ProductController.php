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
       
        $sortOption = $request->query('sort', 'all');
        $page = $request->query('page', 1);
        $selectedCategories = json_decode($request->query('selectedCategories', '[]'));
        $selectedBrands = json_decode($request->query('selectedBrands', '[]'));
        $minPrice = $request->query('min_price', 0);
        $maxPrice = $request->query('max_price', 1000);
        $searchKey = $request->query('searchKey', '');
    
        // Generate cache key
        $cacheKey = "products_{$page}_{$sortOption}_" . md5(
            implode('_', $selectedCategories) . "_" .
            implode('_', $selectedBrands) . "_{$minPrice}_{$maxPrice}_{$searchKey}"
        );
    
        $products = Cache::remember($cacheKey, 600, function() use (
            $sortOption, $page, $selectedCategories, $selectedBrands, $minPrice, $maxPrice, $searchKey
        ) {
            $query = Product::select('id', 'name', 'price', 'category_id', 'brand_id')
                ->with([
                    'images' => function ($q) {
                        $q->select('id', 'product_id', 'file_path')->limit(1);
                    },
                    'category:id,name',
                    'brand:id,name',
                ]);
    
            // Apply filters
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
    
            $query->whereBetween('price', [$minPrice, $maxPrice]);
    
            if (!empty($searchKey)) {
                $query->where('name', 'like', '%' . $searchKey . '%');
            }
    
            // Apply sorting
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
                default:
                    break;
            }
    
            return $query->paginate(9, ['*'], 'page', $page);
        });
    
            // Transform products to include discount information
            $products->getCollection()->transform(function ($product) {
                // Include discount information
                $product->discounted_price = $product->price;
                $currentDiscount = $product->currentDiscount();
    
                if ($currentDiscount) {
                    if ($currentDiscount->discount_type === 'percentage') {
                        $product->discounted_price = $product->price * (1 - $currentDiscount->discount_value / 100);
                    } else {
                        $product->discounted_price = $product->price - $currentDiscount->discount_value;
                    }
                    $product->is_discounted = true;
                    $product->discount_name = $currentDiscount->name;
                    $product->discount_code = $currentDiscount->code;
                } else {
                    $product->is_discounted = false;
                }
    
                return $product;
            });
    
            return response()->json($products);
    
       
    }
    
    
    public function category()
    {
        $categories = Cache::remember('categories_with_products', 600, function() {
            return Category::has('products')
                ->select('id', 'name')
                ->get();
        });
    
        return response()->json($categories);
    }

    public function brand()
    {
        $brands = Cache::remember('brands_with_products', 600, function() {
            return Brand::has('products')
                ->select('id', 'name','logo_path')
                ->get();
        });
    
        return response()->json($brands);
    }

    public function bestSellingProduct()
    {
        try {
            $bestsellingPrd = Cache::remember('best_selling_products', 600, function() {
                return Product::with(['images:id,product_id,file_path', 'category:id,name', 'discounts'])
                    ->withSum('orderDetails', 'quantity')
                    ->orderBy('order_details_sum_quantity', 'desc')
                    ->take(10) // Limit to top 10 products
                    ->get(['id', 'name', 'price', 'category_id', 'brand_id']);
            });

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

    // public function priceAscending(Request $request)
    // {
    //     $products = Product::with(['images:id,product_id,file_path', 'category:id,name', 'brand:id,name'])
    //                         ->orderBy('price', 'asc')
    //                         ->paginate(20); // 20 products per page
    
    //     return response()->json($products);
    // }
    
    // public function priceDescending(Request $request)
    // {
    //     $products = Product::with(['images:id,product_id,file_path', 'category:id,name', 'brand:id,name'])
    //                         ->orderBy('price', 'desc')
    //                         ->paginate(20); // 20 products per page
    
    //     return response()->json($products);
    // }

    public function selectProductBestRating(Request $request)
    {
        $products = Product::with(['images:id,product_id,file_path', 'category:id,name', 'brand:id,name'])
                            ->withAvg('ratings', 'rating') // Assuming 'ratings' relationship
                            ->orderByDesc('ratings_avg_rating')
                            ->paginate(20);
    
        return response()->json($products);
    }

    public function search(Request $request)
{
    try {
        $key = $request->searchKey;

        
        $cacheKey = "search_{$key}";

       
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
        $product = Product::with(['images', 'category', 'brand'])
            ->withAvg('ratings as avg_rating', 'rating')
            ->withCount('ratings')
            ->find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        
        $product->avg_rating = number_format($product->avg_rating, 1);

        $relatedByCategory = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(['images', 'category', 'brand'])
            ->withAvg('ratings as avg_rating', 'rating')
            ->withCount('ratings')
            ->limit(5)
            ->get();

        $relatedByBrand = Product::where('brand_id', $product->brand_id)
            ->where('id', '!=', $product->id)
            ->with(['images', 'category', 'brand'])
            ->withAvg('ratings as avg_rating', 'rating')
            ->withCount('ratings')
            ->limit(5)
            ->get();

        // Format ratings for related products
        $relatedByCategory->each(function ($product) {
            $product->avg_rating = number_format($product->avg_rating, 1);
        });

        $relatedByBrand->each(function ($product) {
            $product->avg_rating = number_format($product->avg_rating, 1);
        });

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
