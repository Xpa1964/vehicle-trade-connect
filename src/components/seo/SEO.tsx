import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

/**
 * SEO Component for dynamic meta tags
 * Uses react-helmet-async for SSR compatibility
 */
export const SEO = ({
  title,
  description = 'KONTACT VO - La plataforma líder B2B para profesionales del sector automotriz. Compra, venta, subastas e intercambio de vehículos usados.',
  keywords = 'automotive marketplace, used car trading, vehicle auction, car dealer software, automotive B2B, vehicle exchange',
  image = '/lovable-uploads/a645acd2-f5c2-4f99-be3b-9d089c634c3c.png',
  url,
  type = 'website',
  author = 'KONTACT VO',
  publishedTime,
  modifiedTime,
  locale = 'es_ES',
  noindex = false,
  nofollow = false,
  canonical,
}: SEOProps) => {
  const siteUrl = 'https://kontactvo.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const fullTitle = title 
    ? `${title} | KONTACT VO` 
    : 'KONTACT VO - Automotive Marketplace | Marketplace Automotriz Profesional';
  
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-image-preview:large',
    'max-snippet:-1',
    'max-video-preview:-1'
  ].join(', ');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="KONTACT VO" />
      <meta property="og:locale" content={locale} />
      
      {/* Article specific tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
};

/**
 * Generate structured data for vehicles
 */
export const generateVehicleStructuredData = (vehicle: {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image?: string;
  description?: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    'name': `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
    'brand': {
      '@type': 'Brand',
      'name': vehicle.make
    },
    'model': vehicle.model,
    'productionDate': vehicle.year.toString(),
    'offers': {
      '@type': 'Offer',
      'price': vehicle.price,
      'priceCurrency': 'EUR',
      'availability': 'https://schema.org/InStock',
      'url': `https://kontact-vo.lovable.app/vehicle/${vehicle.id}`
    },
    ...(vehicle.image && { 'image': vehicle.image }),
    ...(vehicle.description && { 'description': vehicle.description }),
    ...(vehicle.mileage && { 'mileageFromOdometer': { '@type': 'QuantitativeValue', 'value': vehicle.mileage, 'unitCode': 'KMT' } }),
    ...(vehicle.fuelType && { 'fuelType': vehicle.fuelType }),
    ...(vehicle.transmission && { 'vehicleTransmission': vehicle.transmission }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

/**
 * Generate structured data for articles/blog posts
 */
export const generateArticleStructuredData = (article: {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.description,
    'author': {
      '@type': 'Person',
      'name': article.author
    },
    'datePublished': article.publishedDate,
    ...(article.modifiedDate && { 'dateModified': article.modifiedDate }),
    ...(article.image && { 'image': article.image }),
    'publisher': {
      '@type': 'Organization',
      'name': 'KONTACT VO',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://kontact-vo.lovable.app/lovable-uploads/a645acd2-f5c2-4f99-be3b-9d089c634c3c.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': article.url
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
