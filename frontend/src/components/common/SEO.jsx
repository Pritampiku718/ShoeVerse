import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title,
  description = 'Premium sneaker marketplace',
  keywords = 'sneakers, shoes, footwear',
  image = '/og-image.jpg',
  url,
  noIndex = false,
}) => {
  
  const pageTitle = title ? `${title} | ShoeVerse` : 'ShoeVerse - Premium Sneaker Marketplace';
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Basic */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export const HomeSEO = () => <SEO />;

export const ProductSEO = ({ product }) => (
  <SEO 
    title={product.name}
    description={product.description}
    image={product.image}
  />
);

export default SEO;