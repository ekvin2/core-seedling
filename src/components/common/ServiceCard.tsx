import * as React from "react";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ServiceCardProps {
  /** Unique identifier for the service */
  id: string;
  /** Service title */
  title: string;
  /** Service heading/tagline */
  heading?: string;
  /** Service description */
  description: string;
  /** Image URL for the service */
  imageUrl?: string;
  /** Service slug for navigation */
  slug?: string;
  /** Whether this is a featured service */
  featured?: boolean;
  /** Display order */
  displayOrder?: number;
  /** Click handler for CTA button */
  onCtaClick?: (id: string) => void;
  /** Click handler for card */
  onCardClick?: (id: string) => void;
  /** CTA button text */
  ctaText?: string;
  /** Card variant */
  variant?: "default" | "compact" | "featured" | "minimal";
  /** Custom className */
  className?: string;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: Error | null;
  /** Accessibility label */
  ariaLabel?: string;
}

export interface ServiceCardSkeletonProps {
  /** Card variant */
  variant?: "default" | "compact" | "featured" | "minimal";
  /** Custom className */
  className?: string;
}

export interface ServiceCardEmptyProps {
  /** Empty state message */
  message?: string;
  /** Custom className */
  className?: string;
}

export interface ServiceCardErrorProps {
  /** Error object */
  error: Error;
  /** Retry handler */
  onRetry?: () => void;
  /** Custom className */
  className?: string;
}

// ============================================================================
// SKELETON LOADING STATE
// ============================================================================

export const ServiceCardSkeleton: React.FC<ServiceCardSkeletonProps> = ({
  variant = "default",
  className,
}) => {
  const isCompact = variant === "compact" || variant === "minimal";
  const isFeatured = variant === "featured";

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all",
        isFeatured && "border-primary shadow-lg",
        className
      )}
    >
      {!isCompact && (
        <Skeleton className="h-48 w-full rounded-t-lg" />
      )}
      <CardHeader className={cn(isCompact && "pb-3")}>
        <Skeleton className="h-6 w-3/4" />
        {!isCompact && <Skeleton className="h-4 w-1/2 mt-2" />}
      </CardHeader>
      <CardContent className={cn(isCompact && "py-0")}>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mt-2" />
        {!isCompact && <Skeleton className="h-4 w-4/6 mt-2" />}
      </CardContent>
      {!isCompact && (
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      )}
    </Card>
  );
};

// ============================================================================
// EMPTY STATE
// ============================================================================

export const ServiceCardEmpty: React.FC<ServiceCardEmptyProps> = ({
  message = "No services available",
  className,
}) => {
  return (
    <Card className={cn("p-8 text-center", className)}>
      <CardContent className="flex flex-col items-center gap-3">
        <Sparkles className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// ERROR STATE
// ============================================================================

export const ServiceCardError: React.FC<ServiceCardErrorProps> = ({
  error,
  onRetry,
  className,
}) => {
  return (
    <Card className={cn("border-destructive", className)}>
      <CardContent className="flex flex-col items-center gap-3 py-8">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <p className="font-medium text-destructive">Failed to load service</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error.message || "An unexpected error occurred"}
          </p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="mt-2"
            aria-label="Retry loading service"
          >
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  heading,
  description,
  imageUrl,
  slug,
  featured = false,
  displayOrder,
  onCtaClick,
  onCardClick,
  ctaText = "Learn More",
  variant = "default",
  className,
  loading = false,
  error = null,
  ariaLabel,
}) => {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured" || featured;
  const isMinimal = variant === "minimal";
  const isInteractive = !!onCardClick;

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onCardClick?.(id);
    }
  };

  // Handle CTA click
  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCtaClick?.(id);
  };

  // Handle card click
  const handleCardClick = () => {
    if (isInteractive) {
      onCardClick?.(id);
    }
  };

  // Loading state
  if (loading) {
    return <ServiceCardSkeleton variant={variant} className={className} />;
  }

  // Error state
  if (error) {
    return <ServiceCardError error={error} className={className} />;
  }

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300",
        isFeatured && "border-primary shadow-lg ring-2 ring-primary/20",
        isInteractive && "cursor-pointer hover:shadow-xl hover:-translate-y-1",
        className
      )}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? "button" : undefined}
      aria-label={ariaLabel || `${title} service card`}
      data-service-id={id}
      data-display-order={displayOrder}
    >
      {/* Image Section */}
      {!isCompact && !isMinimal && imageUrl && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={`${title} service`}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          {isFeatured && (
            <Badge
              className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm"
              aria-label="Featured service"
            >
              <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
              Featured
            </Badge>
          )}
        </div>
      )}

      {/* Content Section */}
      <CardHeader className={cn(isCompact && "pb-3")}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className={cn(
              "line-clamp-2",
              isFeatured && "text-primary",
              isCompact && "text-lg"
            )}
          >
            {title}
          </CardTitle>
          {isFeatured && (isCompact || isMinimal) && (
            <Badge variant="default" className="shrink-0" aria-label="Featured service">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
            </Badge>
          )}
        </div>
        {heading && !isMinimal && (
          <CardDescription className="line-clamp-1">{heading}</CardDescription>
        )}
      </CardHeader>

      <CardContent className={cn(isCompact && "py-0", isMinimal && "pt-0")}>
        <p
          className={cn(
            "text-sm text-muted-foreground",
            isCompact ? "line-clamp-2" : "line-clamp-3"
          )}
        >
          {description}
        </p>
      </CardContent>

      {/* Footer with CTA */}
      {!isMinimal && (
        <CardFooter className={cn(isCompact && "pt-3")}>
          <Button
            className="w-full"
            variant={isFeatured ? "default" : "outline"}
            onClick={handleCtaClick}
            aria-label={`${ctaText} for ${title}`}
          >
            {ctaText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

// ============================================================================
// CONTAINER FOR MULTIPLE CARDS
// ============================================================================

export interface ServiceCardListProps {
  /** Array of services */
  services: ServiceCardProps[];
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: Error | null;
  /** Number of skeleton cards to show */
  skeletonCount?: number;
  /** Grid columns configuration */
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Card variant */
  variant?: ServiceCardProps["variant"];
  /** Empty state message */
  emptyMessage?: string;
  /** Custom className */
  className?: string;
  /** Shared CTA click handler */
  onCtaClick?: (id: string) => void;
  /** Shared card click handler */
  onCardClick?: (id: string) => void;
}

export const ServiceCardList: React.FC<ServiceCardListProps> = ({
  services,
  loading = false,
  error = null,
  skeletonCount = 3,
  columns = { default: 1, md: 2, lg: 3 },
  variant = "default",
  emptyMessage,
  className,
  onCtaClick,
  onCardClick,
}) => {
  const gridCols = cn(
    "grid gap-6",
    columns.default && `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`
  );

  // Loading state
  if (loading) {
    return (
      <div className={cn(gridCols, className)} role="status" aria-label="Loading services">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ServiceCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        <ServiceCardError error={error} />
      </div>
    );
  }

  // Empty state
  if (!services || services.length === 0) {
    return (
      <div className={className}>
        <ServiceCardEmpty message={emptyMessage} />
      </div>
    );
  }

  // Render services
  return (
    <div className={cn(gridCols, className)}>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          {...service}
          variant={variant}
          onCtaClick={onCtaClick}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
};

ServiceCard.displayName = "ServiceCard";
ServiceCardSkeleton.displayName = "ServiceCardSkeleton";
ServiceCardEmpty.displayName = "ServiceCardEmpty";
ServiceCardError.displayName = "ServiceCardError";
ServiceCardList.displayName = "ServiceCardList";
