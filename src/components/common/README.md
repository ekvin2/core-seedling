# ServiceCard Component

A comprehensive, accessible, and reusable React component for displaying cleaning services with multiple variants, states, and full TypeScript support.

## Features

✅ **Multiple Variants**: Default, Featured, Compact, and Minimal
✅ **Loading States**: Built-in skeleton loading UI
✅ **Error Handling**: Graceful error states with retry functionality
✅ **Empty States**: Customizable empty state messaging
✅ **Fully Accessible**: ARIA labels, keyboard navigation, semantic HTML
✅ **Responsive**: Mobile-first design with flexible grid layouts
✅ **TypeScript**: Complete type definitions and interfaces
✅ **Interactive**: Click handlers for cards and CTA buttons
✅ **Customizable**: Extensive prop options and className support

## Installation

The component is already integrated into your project. Import it from:

```tsx
import { ServiceCard, ServiceCardList } from "@/components/common/ServiceCard";
```

## Basic Usage

### Single Service Card

```tsx
import { ServiceCard } from "@/components/common/ServiceCard";

function MyComponent() {
  const handleGetQuote = (serviceId: string) => {
    console.log("Open quote form for:", serviceId);
  };

  return (
    <ServiceCard
      id="1"
      title="Deep Cleaning"
      description="Professional deep cleaning service"
      imageUrl="https://example.com/image.jpg"
      onCtaClick={handleGetQuote}
      ctaText="Get Quote"
    />
  );
}
```

### Service Grid

```tsx
import { ServiceCardList } from "@/components/common/ServiceCard";

function ServicesPage() {
  const services = [
    {
      id: "1",
      title: "Deep Cleaning",
      description: "Complete home deep clean",
      imageUrl: "/images/deep-clean.jpg",
    },
    // ... more services
  ];

  return (
    <ServiceCardList
      services={services}
      columns={{ default: 1, md: 2, lg: 3 }}
      onCtaClick={(id) => openQuoteModal(id)}
      onCardClick={(id) => navigateToService(id)}
    />
  );
}
```

## Variants

### Default
Full-featured card with image, description, and CTA button.

```tsx
<ServiceCard {...props} variant="default" />
```

### Featured
Highlighted card with primary color border and featured badge.

```tsx
<ServiceCard {...props} variant="featured" featured={true} />
```

### Compact
Condensed version without image, perfect for sidebars.

```tsx
<ServiceCard {...props} variant="compact" />
```

### Minimal
Streamlined version without CTA button, ideal for read-only displays.

```tsx
<ServiceCard {...props} variant="minimal" />
```

## Props Reference

### ServiceCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | Unique service identifier |
| `title` | `string` | **required** | Service title |
| `description` | `string` | **required** | Service description |
| `heading` | `string` | `undefined` | Optional heading/tagline |
| `imageUrl` | `string` | `undefined` | Service image URL |
| `slug` | `string` | `undefined` | URL slug for routing |
| `featured` | `boolean` | `false` | Show featured badge |
| `displayOrder` | `number` | `undefined` | Sort order |
| `onCtaClick` | `(id: string) => void` | `undefined` | CTA button handler |
| `onCardClick` | `(id: string) => void` | `undefined` | Card click handler |
| `ctaText` | `string` | `"Learn More"` | CTA button text |
| `variant` | `"default" \| "compact" \| "featured" \| "minimal"` | `"default"` | Card style variant |
| `className` | `string` | `undefined` | Custom CSS classes |
| `loading` | `boolean` | `false` | Show loading skeleton |
| `error` | `Error \| null` | `null` | Error state |
| `ariaLabel` | `string` | `undefined` | Custom ARIA label |

### ServiceCardList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `services` | `ServiceCardProps[]` | **required** | Array of services |
| `loading` | `boolean` | `false` | Show loading state |
| `error` | `Error \| null` | `null` | Error state |
| `skeletonCount` | `number` | `3` | Number of skeleton cards |
| `columns` | `object` | `{ default: 1, md: 2, lg: 3 }` | Responsive grid config |
| `variant` | `string` | `"default"` | Applied to all cards |
| `emptyMessage` | `string` | `undefined` | Custom empty message |
| `className` | `string` | `undefined` | Custom CSS classes |
| `onCtaClick` | `(id: string) => void` | `undefined` | Shared CTA handler |
| `onCardClick` | `(id: string) => void` | `undefined` | Shared card handler |

## States

### Loading State

```tsx
<ServiceCard {...props} loading={true} />
// or
<ServiceCardList services={[]} loading={true} skeletonCount={3} />
```

### Error State

```tsx
<ServiceCard 
  {...props} 
  error={new Error("Failed to load")} 
/>
```

### Empty State

```tsx
<ServiceCardList 
  services={[]} 
  emptyMessage="No services available"
/>
```

## Responsive Grid

Customize the grid layout for different screen sizes:

```tsx
<ServiceCardList
  services={services}
  columns={{
    default: 1,  // Mobile
    sm: 1,       // Small tablets
    md: 2,       // Tablets
    lg: 3,       // Desktop
    xl: 4,       // Large desktop
  }}
/>
```

## Accessibility

The component includes comprehensive accessibility features:

- ✅ **ARIA Labels**: Proper labeling for screen readers
- ✅ **Keyboard Navigation**: Full keyboard support (Enter, Space)
- ✅ **Focus Management**: Visible focus indicators
- ✅ **Semantic HTML**: Proper element roles
- ✅ **Alt Text**: Image descriptions
- ✅ **Loading States**: Announced to screen readers

### Example with Custom ARIA

```tsx
<ServiceCard
  {...props}
  ariaLabel="Premium deep cleaning service - Get a quote"
/>
```

## Integration with Supabase

### Fetching Services

```tsx
import { supabase } from "@/integrations/supabase/client";
import { ServiceCardList } from "@/components/common/ServiceCard";

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("display_order");

        if (error) throw error;
        
        setServices(data.map(service => ({
          id: service.id,
          title: service.title,
          heading: service.heading,
          description: service.content,
          imageUrl: service.service_image_url,
          slug: service.slug,
        })));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return (
    <ServiceCardList
      services={services}
      loading={loading}
      error={error}
      onCtaClick={handleQuoteRequest}
    />
  );
}
```

## Styling

The component uses Tailwind CSS and follows your design system tokens:

```tsx
// Custom styling
<ServiceCard
  {...props}
  className="border-2 shadow-2xl hover:shadow-3xl"
/>
```

## Testing

See `ServiceCard.test.tsx` for comprehensive unit tests covering:
- ✅ Rendering with various props
- ✅ User interactions (clicks, keyboard)
- ✅ State management (loading, error, empty)
- ✅ Accessibility features
- ✅ Responsive behavior

Run tests with:
```bash
npm test ServiceCard.test.tsx
```

## Examples

See `ServiceCard.stories.tsx` for 12+ interactive examples including:
1. Default Variant
2. Featured Variant
3. Compact Variant
4. Minimal Variant
5. Interactive Card
6. Loading States
7. Error States
8. Empty States
9. Service Grid
10. Responsive Grid
11. All Variants Comparison
12. Real-World Integration

## Performance

- ✅ **Lazy Loading**: Images use `loading="lazy"`
- ✅ **Tree Shaking**: Only import what you need
- ✅ **Optimized Re-renders**: Memoization where needed
- ✅ **Skeleton Loading**: Smooth loading experience

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome)

## Contributing

When modifying the component:
1. Update TypeScript types
2. Add corresponding tests
3. Update this README
4. Add examples to stories file

## License

Part of your cleaning services website project.
