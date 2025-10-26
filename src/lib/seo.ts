// SEO Utility Functions and Schema Generation

export const BUSINESS_INFO = {
  name: "Easy House Wash NZ",
  description: "Professional house washing and cleaning services across New Zealand",
  phone: "+64 21 123 4567",
  email: "info@easyhousewash.nz",
  address: {
    streetAddress: "Auckland Central",
    addressLocality: "Auckland",
    addressRegion: "Auckland",
    postalCode: "1010",
    country: "New Zealand"
  },
  url: typeof window !== 'undefined' ? window.location.origin : '',
  socialProfiles: [
    "https://www.facebook.com/easyhousewashnz",
    "https://www.instagram.com/easyhousewashnz",
    "https://twitter.com/easyhousewashnz"
  ],
  openingHours: ["Mo-Fr 07:00-19:00", "Sa 08:00-17:00", "Su 09:00-15:00"],
  priceRange: "$$",
  aggregateRating: {
    ratingValue: "4.9",
    reviewCount: "250",
    bestRating: "5",
    worstRating: "1"
  },
  geo: {
    latitude: "-36.8485",
    longitude: "174.7633"
  },
  areaServed: [
    "Auckland",
    "Wellington",
    "Christchurch",
    "Hamilton",
    "Tauranga",
    "Dunedin"
  ]
};

// Generate Local Business Schema
export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BUSINESS_INFO.url}#organization`,
  "name": BUSINESS_INFO.name,
  "description": BUSINESS_INFO.description,
  "url": BUSINESS_INFO.url,
  "telephone": BUSINESS_INFO.phone,
  "email": BUSINESS_INFO.email,
  "image": `${BUSINESS_INFO.url}/placeholder.svg`,
  "address": {
    "@type": "PostalAddress",
    ...BUSINESS_INFO.address
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": BUSINESS_INFO.geo.latitude,
    "longitude": BUSINESS_INFO.geo.longitude
  },
  "openingHoursSpecification": BUSINESS_INFO.openingHours.map(hours => {
    const [days, time] = hours.split(' ');
    const [opens, closes] = time.split('-');
    return {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": days.split('-').map(day => {
        const dayMap: Record<string, string> = {
          Mo: "Monday", Tu: "Tuesday", We: "Wednesday", 
          Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday"
        };
        return dayMap[day] || day;
      }),
      "opens": opens,
      "closes": closes
    };
  }),
  "priceRange": BUSINESS_INFO.priceRange,
  "aggregateRating": {
    "@type": "AggregateRating",
    ...BUSINESS_INFO.aggregateRating
  },
  "areaServed": BUSINESS_INFO.areaServed.map(area => ({
    "@type": "City",
    "name": area,
    "addressCountry": "NZ"
  })),
  "sameAs": BUSINESS_INFO.socialProfiles,
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "House Washing Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Exterior House Washing",
          "description": "Professional exterior house washing services"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Roof Cleaning",
          "description": "Soft wash roof cleaning services"
        }
      }
    ]
  }
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
