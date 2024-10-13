import { Link } from 'react-router-dom';
import NotFoundImage from '../../assets/images/empty.png';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaHeart, FaEye } from 'react-icons/fa';
import { BsCart } from 'react-icons/bs';
import { IoHeartDislike } from 'react-icons/io5';
import PropTypes from 'prop-types';


const Products = ({
  products,
  loading,
  error,
  favorites,
  handleFavoriteToggle,
  addToCart,
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center">
        <img src={NotFoundImage} alt="No products found" className="mx-auto mb-4" />
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
              <img
                src={`http://127.0.0.1:8000/storage/${
                  product.images && product.images.length > 0 && product.images[0].file_path
                }`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleFavoriteToggle(product.id)}
                    className="text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    {favorites.includes(product.id) ? <IoHeartDislike size={20} /> : <FaHeart size={20} />}
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    <FaEye size={20} />
                  </Link>
                  <button
                    onClick={() =>
                      addToCart(
                        product.id,
                        1,
                        product.name,
                        product.images && product.images.length > 0
                          ? `http://127.0.0.1:8000/storage/${product.images[0].file_path}`
                          : '',
                        product.price
                      )
                    }
                    className="text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    <BsCart size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-gray-600">{product.price} MAD</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Products.propTypes = {
    products: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            file_path: PropTypes.string.isRequired,
          })
        ),
        price: PropTypes.string.isRequired,
      })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    favorites: PropTypes.arrayOf(PropTypes.number).isRequired,
    handleFavoriteToggle: PropTypes.func.isRequired,
    addToCart: PropTypes.func.isRequired,
  };

export default Products;
