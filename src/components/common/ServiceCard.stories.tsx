/**
 * ServiceCard Component - Usage Examples
 * 
 * This file demonstrates various use cases and configurations
 * for the ServiceCard component.
 */

import React from "react";
import { ServiceCard, ServiceCardList, ServiceCardSkeleton, ServiceCardEmpty, ServiceCardError } from "./ServiceCard";

// ============================================================================
// MOCK DATA
// ============================================================================

const mockService = {
  id: "1",
  title: "Deep Cleaning Service",
  heading: "Professional Deep Clean",
  description: "Our comprehensive deep cleaning service covers every corner of your home, from baseboards to ceiling fans. Perfect for spring cleaning or moving in/out.",
  imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
  slug: "deep-cleaning",
  featured: false,
};

const mockServices = [
  {
    ...mockService,
    id: "1",
    featured: true,
  },
  {
    id: "2",
    title: "Regular Maintenance",
    heading: "Weekly/Bi-weekly Cleaning",
    description: "Keep your home consistently clean with our regular maintenance service. Customizable schedule to fit your needs.",
    imageUrl: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400",
    slug: "regular-maintenance",
  },
  {
    id: "3",
    title: "Move-In/Out Cleaning",
    heading: "Fresh Start Guarantee",
    description: "Thorough cleaning for moving transitions. We ensure your new place sparkles or your old place is ready for the next tenant.",
    imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400",
    slug: "move-cleaning",
  },
];

// ============================================================================
// EXAMPLE 1: Default Variant
// ============================================================================

export const DefaultVariant = () => {
  const handleCtaClick = (id: string) => {
    console.log(`CTA clicked for service: ${id}`);
    alert(`Learn more about service ${id}`);
  };

  return (
    <div className="p-8 max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Default Service Card</h2>
      <ServiceCard
        {...mockService}
        onCtaClick={handleCtaClick}
        ctaText="Get Quote"
      />
    </div>
  );
};

// ============================================================================
// EXAMPLE 2: Featured Variant
// ============================================================================

export const FeaturedVariant = () => {
  return (
    <div className="p-8 max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Featured Service Card</h2>
      <ServiceCard
        {...mockService}
        variant="featured"
        featured={true}
        onCtaClick={(id) => console.log("Featured service:", id)}
      />
    </div>
  );
};

// ============================================================================
// EXAMPLE 3: Compact Variant
// ============================================================================

export const CompactVariant = () => {
  return (
    <div className="p-8 max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Compact Service Card</h2>
      <ServiceCard
        {...mockService}
        variant="compact"
        onCtaClick={(id) => console.log("Compact service:", id)}
      />
    </div>
  );
};

// ============================================================================
// EXAMPLE 4: Minimal Variant
// ============================================================================

export const MinimalVariant = () => {
  return (
    <div className="p-8 max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Minimal Service Card</h2>
      <ServiceCard
        {...mockService}
        variant="minimal"
        featured={true}
      />
    </div>
  );
};

// ============================================================================
// EXAMPLE 5: Interactive Card (Clickable)
// ============================================================================

export const InteractiveCard = () => {
  const handleCardClick = (id: string) => {
    console.log(`Card clicked: ${id}`);
    alert(`Navigating to service page: ${id}`);
  };

  const handleCtaClick = (id: string) => {
    console.log(`CTA clicked: ${id}`);
    alert(`Opening quote form for service: ${id}`);
  };

  return (
    <div className="p-8 max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Interactive Card</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Click the card to navigate, or click "Get Quote" button
      </p>
      <ServiceCard
        {...mockService}
        onCardClick={handleCardClick}
        onCtaClick={handleCtaClick}
        ctaText="Get Quote"
      />
    </div>
  );
};

// ============================================================================
// EXAMPLE 6: Loading State
// ============================================================================

export const LoadingState = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Loading States</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Default</h3>
          <ServiceCardSkeleton />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-3">Compact</h3>
          <ServiceCardSkeleton variant="compact" />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-3">Featured</h3>
          <ServiceCardSkeleton variant="featured" />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 7: Error State
// ============================================================================

export const ErrorState = () => {
  return (
    <div className="p-8 max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Error State</h2>
      <ServiceCard
        {...mockService}
        error={new Error("Failed to load service data")}
      />
    </div>
  );
};

// ============================================================================
// EXAMPLE 8: Empty State
// ============================================================================

export const EmptyState = () => {
  return (
    <div className="p-8 max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Empty State</h2>
      <ServiceCardEmpty message="No cleaning services available in your area" />
    </div>
  );
};

// ============================================================================
// EXAMPLE 9: Service Card List (Grid)
// ============================================================================

export const ServiceGrid = () => {
  const [loading, setLoading] = React.useState(false);

  const toggleLoading = () => {
    setLoading(!loading);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Service Grid</h2>
        <button
          onClick={toggleLoading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          {loading ? "Show Services" : "Show Loading"}
        </button>
      </div>
      <ServiceCardList
        services={mockServices}
        loading={loading}
        onCtaClick={(id) => console.log("Quote requested:", id)}
        onCardClick={(id) => console.log("Navigate to:", id)}
        columns={{ default: 1, md: 2, lg: 3 }}
      />
    </div>
  );
};

// ============================================================================
// EXAMPLE 10: Responsive Grid Configurations
// ============================================================================

export const ResponsiveGrid = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Responsive Grid (Resize window)</h2>
      <p className="text-sm text-muted-foreground mb-6">
        1 column on mobile, 2 on tablet, 3 on desktop, 4 on xl screens
      </p>
      <ServiceCardList
        services={[...mockServices, ...mockServices]}
        columns={{ default: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
        variant="compact"
      />
    </div>
  );
};

// ============================================================================
// EXAMPLE 11: All Variants Side by Side
// ============================================================================

export const AllVariants = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">All Variants</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Default</h3>
          <ServiceCard {...mockService} variant="default" />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-3">Featured</h3>
          <ServiceCard {...mockService} variant="featured" featured={true} />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-3">Compact</h3>
          <ServiceCard {...mockService} variant="compact" />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-3">Minimal</h3>
          <ServiceCard {...mockService} variant="minimal" />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 12: Real-World Integration Example
// ============================================================================

export const RealWorldExample = () => {
  const [services, setServices] = React.useState(mockServices);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const handleCtaClick = (serviceId: string) => {
    // Open quote modal
    alert(`Opening quote form for service: ${serviceId}`);
  };

  const handleCardClick = (serviceId: string) => {
    // Navigate to service detail page
    console.log(`Navigate to /services/${serviceId}`);
  };

  const simulateError = () => {
    setError(new Error("Network error: Failed to fetch services"));
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Real-World Example</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLoading(!loading)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
          >
            Toggle Loading
          </button>
          <button
            onClick={simulateError}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm"
          >
            Simulate Error
          </button>
          {error && (
            <button
              onClick={clearError}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              Clear Error
            </button>
          )}
        </div>
      </div>

      <ServiceCardList
        services={services}
        loading={loading}
        error={error}
        onCtaClick={handleCtaClick}
        onCardClick={handleCardClick}
        columns={{ default: 1, md: 2, lg: 3 }}
        emptyMessage="No services available at the moment"
      />
    </div>
  );
};

// ============================================================================
// MAIN DEMO COMPONENT
// ============================================================================

export default function ServiceCardDemo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ServiceCard Component Library</h1>
          <p className="text-muted-foreground">
            Explore all variants and use cases of the ServiceCard component
          </p>
        </div>

        <div className="space-y-16">
          <section>
            <AllVariants />
          </section>

          <section>
            <ServiceGrid />
          </section>

          <section>
            <InteractiveCard />
          </section>

          <section>
            <LoadingState />
          </section>

          <section>
            <RealWorldExample />
          </section>
        </div>
      </div>
    </div>
  );
}
