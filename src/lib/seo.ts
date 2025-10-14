// SEO Utility Functions and Schema Generation

export const BUSINESS_INFO = {
  name: "SparkleClean",
  description: "Professional house cleaning services you can trust",
  phone: "(555) 123-4567",
  email: "info@sparkleclean.com",
  address: {
    streetAddress: "123 Clean Street",
    addressLocality: "Your City",
    addressRegion: "ST",
    postalCode: "12345",
  },
  url: typeof window !== 'undefined' ? window.location.origin : '',
  socialProfiles: [
    "https://www.facebook.com/sparkleclean",
    "https://www.instagram.com/sparkleclean",
    "https://twitter.com/sparkleclean"
  ],
  openingHours: ["Mo-Fr 08:00-18:00", "Sa 09:00-16:00"],
  priceRange: "$$",
  aggregateRating: {
    ratingValue: "4.9",
    reviewCount: "127",
    bestRating: "5",
    worstRating: "1"
  }
};

// Generate Local Business Schema
export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": BUSINESS_INFO.name,
  "description": BUSINESS_INFO.description,
  "url": BUSINESS_INFO.url,
  "telephone": BUSINESS_INFO.phone,
  "email": BUSINESS_INFO.email,
  "address": {
    "@type": "PostalAddress",
    ...BUSINESS_INFO.address
  },
  "openingHours": BUSINESS_INFO.openingHours,
  "priceRange": BUSINESS_INFO.priceRange,
  "aggregateRating": {
    "@type": "AggregateRating",
    ...BUSINESS_INFO.aggregateRating
  },
  "sameAs": BUSINESS_INFO.socialProfiles
});

// Generate Service Schema
export const generateServiceSchema = (service: {
  name: string;
  description: string;
  slug: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": service.name,
  "description": service.description,
  "provider": {
    "@type": "LocalBusiness",
    "name": BUSINESS_INFO.name,
    "telephone": BUSINESS_INFO.phone,
    "url": BUSINESS_INFO.url
  },
  "areaServed": {
    "@type": "City",
    "name": BUSINESS_INFO.address.addressLocality
  },
  "url": `${BUSINESS_INFO.url}/service/${service.slug}`
});

// Generate FAQ Schema
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Generate Review Schema
export const generateReviewSchema = (reviews: Array<{
  name: string;
  rating: number;
  review: string;
  date: string;
}>) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": BUSINESS_INFO.name,
  "aggregateRating": {
    "@type": "AggregateRating",
    ...BUSINESS_INFO.aggregateRating
  },
  "review": reviews.map(review => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.name
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": "5",
      "worstRating": "1"
    },
    "reviewBody": review.review,
    "datePublished": review.date
  }))
});

// Generate Breadcrumb Schema
export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// Generate XML Sitemap URLs
export const generateSitemapUrls = (services: Array<{ slug: string; updated_at?: string }>) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    { url: `${baseUrl}/`, changefreq: 'weekly', priority: '1.0', lastmod: currentDate },
    { url: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.8', lastmod: currentDate },
    { url: `${baseUrl}/gallery`, changefreq: 'weekly', priority: '0.7', lastmod: currentDate },
    { url: `${baseUrl}/privacy-policy`, changefreq: 'yearly', priority: '0.3', lastmod: currentDate },
    { url: `${baseUrl}/terms-of-service`, changefreq: 'yearly', priority: '0.3', lastmod: currentDate },
  ];

  const servicePages = services.map(service => ({
    url: `${baseUrl}/service/${service.slug}`,
    changefreq: 'monthly',
    priority: '0.9',
    lastmod: service.updated_at ? new Date(service.updated_at).toISOString().split('T')[0] : currentDate
  }));

  return [...staticPages, ...servicePages];
};

// Helper to inject structured data into page
export const injectStructuredData = (schema: object) => {
  if (typeof document === 'undefined') return;
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
  
  return () => {
    if (script.parentNode) {
      document.head.removeChild(script);
    }
  };
};
