import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../../components/home/Hero';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import CategoryShowcase from '../../components/home/CategoryShowcase';
import TrendingNow from '../../components/home/TrendingNow';
import Testimonials from '../../components/home/Testimonials';
import BrandStrip from '../../components/home/BrandStrip';
import InstagramFeed from '../../components/home/InstagramFeed';
import Newsletter from '../../components/home/Newsletter';
import FlashSale from '../../components/home/FlashSale';
import Stats from '../../components/home/Stats';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>ShoeVerse - Premium Sneaker Marketplace | Exclusive Drops & Limited Editions</title>
        <meta name="description" content="Discover the world's most exclusive sneakers. From Nike Air Max to Jordan Retro, find your perfect pair at ShoeVerse. Free shipping on orders $100+" />
        <meta name="keywords" content="sneakers, nike, adidas, jordan, yeezy, shoes, footwear, streetwear, exclusive kicks, limited edition" />
        <meta property="og:title" content="ShoeVerse - Premium Sneaker Marketplace" />
        <meta property="og:description" content="Discover the most exclusive sneakers from top brands. Your perfect pair awaits." />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <Hero />

        {/* Brand Strip - Floating Logos */}
        <BrandStrip />

        {/* Featured Products with Parallax */}
        <FeaturedProducts />

        {/* Category Showcase with 3D Cards */}
        <CategoryShowcase />

        {/* Flash Sale Timer with Countdown */}
        <FlashSale />

        {/* Trending Now Section */}
        <TrendingNow />

        {/* Stats Counter Section */}
        <Stats />

        {/* Testimonials with Video Reviews */}
        <Testimonials />

        {/* Instagram Feed */}
        <InstagramFeed />

        {/* Newsletter with Popup Effect */}
        <Newsletter />

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </motion.div>
    </>
  );
};

// Scroll to Top Component - Moved outside and properly imported
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-primary-600 to-accent text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default Home;