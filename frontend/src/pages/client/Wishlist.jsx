import { useWishlistStore } from '../../store/wishlistStore';
import ProductCard from '../../components/product/ProductCard';
import { Helmet } from 'react-helmet-async';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { items } = useWishlistStore();

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Wishlist - ShoeVerse</title>
        </Helmet>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Found something you love? Save it here ❤️
            </p>
            <Link to="/products" className="btn-primary inline-block">
              Browse Products
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Wishlist - ShoeVerse</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Wishlist ({items.length} items)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Wishlist;