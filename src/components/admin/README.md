# Admin Dashboard Components

Modern, responsive admin dashboard layout system for the cleaning services management panel.

## Overview

This folder contains modular components for building a professional admin interface with:
- **Responsive sidebar navigation** with collapse/expand functionality
- **Top bar** with user profile, notifications, and quick actions
- **Full keyboard accessibility** with ARIA labels
- **Smooth animations** for sidebar transitions
- **Consistent design system** integration

## Components

### DashboardLayout

Main layout wrapper that combines the sidebar and top bar.

**Props:**
- `children: ReactNode` - Content to display in the main area
- `currentSection?: 'dashboard' | 'services' | 'reviews' | 'bookings' | 'clients' | 'settings'` - Current active section

**Example:**
```tsx
import { DashboardLayout } from '@/components/admin';

function MyAdminPage() {
  return (
    <DashboardLayout currentSection="services">
      <div>
        <h1>Services Management</h1>
        {/* Your content */}
      </div>
    </DashboardLayout>
  );
}
```

### AdminSidebar

Navigation sidebar with menu items and active state highlighting.

**Features:**
- Collapsible design (icon-only mode)
- Active route highlighting
- Icon + text labels
- Badge support for "Coming Soon" features
- Keyboard navigation

**Props:**
- `currentSection?: 'dashboard' | 'services' | 'reviews' | 'bookings' | 'clients' | 'settings'`

### TopBar

Header bar with user profile and notifications.

**Features:**
- Sidebar toggle button
- Notification bell with badge count
- User profile dropdown with avatar
- Sign out functionality
- Responsive design

**Props:**
- `notificationCount?: number` - Number of unread notifications

## Usage in Admin Panel

The Admin.tsx page demonstrates full integration:

```tsx
import { DashboardLayout } from '@/components/admin/DashboardLayout';

function Admin() {
  const location = useLocation();
  const currentTab = location.hash.replace('#', '') || 'services';
  
  const getSectionFromTab = (tab: string) => {
    const sectionMap = {
      'services': 'services',
      'reviews': 'reviews',
      'faqs': 'settings',
      'portfolio': 'services',
    };
    return sectionMap[tab] || 'dashboard';
  };

  return (
    <DashboardLayout currentSection={getSectionFromTab(currentTab)}>
      <Tabs value={currentTab}>
        {/* Your tab content */}
      </Tabs>
    </DashboardLayout>
  );
}
```

## Navigation

The sidebar includes these menu items:
- **Dashboard** - Overview and statistics
- **Services** - Manage cleaning services
- **Reviews** - Customer testimonials
- **Bookings** - Appointment management (coming soon)
- **Clients** - Customer database (coming soon)
- **Settings** - Configuration and preferences

## Responsive Behavior

- **Mobile (< 768px)**: Sidebar starts collapsed, overlay mode
- **Tablet (768px - 1024px)**: Sidebar can be toggled
- **Desktop (> 1024px)**: Sidebar expanded by default

## Keyboard Shortcuts

- `Tab` - Navigate through menu items
- `Enter` / `Space` - Activate menu item
- `Escape` - Close sidebar on mobile

## Accessibility

All components include:
- Proper ARIA labels (`aria-label`, `aria-current`)
- Keyboard navigation support
- Focus management
- Screen reader friendly structure

## Styling

The components use the project's design system from `index.css`:
- HSL color tokens
- Semantic color names (primary, muted, accent, etc.)
- Consistent spacing and typography
- Smooth transitions

## Storybook Examples

See `DashboardLayout.stories.tsx` for comprehensive usage examples including:
- Basic dashboard view
- Services management
- Reviews section
- Settings page
- Empty states
- Loading states

## Customization

To add a new menu item:

1. Edit `Sidebar.tsx` and add to the `menuItems` array:
```tsx
const menuItems: MenuItem[] = [
  // ... existing items
  { 
    title: 'Analytics', 
    url: '/admin#analytics', 
    icon: BarChart 
  },
];
```

2. Update the section type in `DashboardLayout.tsx`:
```tsx
type Section = 'dashboard' | 'services' | 'reviews' | 'analytics' | ...;
```

3. Update the section mapping in your page component.

## Dependencies

- `@/components/ui/sidebar` - Shadcn sidebar primitives
- `@/components/ui/button` - Button component
- `@/components/ui/dropdown-menu` - Dropdown menus
- `@/components/ui/avatar` - User avatar
- `lucide-react` - Icon library
- `react-router-dom` - Routing

## Best Practices

1. **Always specify currentSection** to enable proper active state highlighting
2. **Use semantic tokens** from the design system for colors
3. **Maintain keyboard accessibility** when adding new interactive elements
4. **Test responsive behavior** on all screen sizes
5. **Keep sidebar menu items concise** (≤ 6 main items recommended)

## Future Enhancements

Planned features:
- Breadcrumb navigation
- Multi-level menu support
- Theme switcher in top bar
- Search functionality
- Customizable notification center
- User preferences persistence

---

## Additional Admin Components

### ContactDetailsForm
Form component for managing business contact information.

**Features:**
- Phone number management
- Business hours editing
- Social media links (Facebook, Instagram, TikTok)
- Real-time validation
- Success/error notifications

### LeadsManagement
Table view for managing customer leads and quote requests.

**Features:**
- Sortable and filterable table
- Search functionality
- Pagination
- Export capabilities
- Lead status management

### ServicesManagement
Modern interface for managing cleaning services with modal-based editing.

**Features:**
- Modal-based add/edit forms
- Inline table view with quick actions
- Integrated image upload
- Service ordering (move up/down)
- Toggle active/inactive status
- Loading and empty states
- Success/error notifications
- Responsive design

**Usage:**
```tsx
import { ServicesManagement } from '@/components/admin';

<DashboardLayout currentSection="services">
  <ServicesManagement />
</DashboardLayout>
```

### ImageUpload
Comprehensive image upload component with drag-and-drop support and Supabase integration.

**Features:**
- Drag-and-drop or click to upload
- Instant image preview
- Upload progress indicator with percentage
- Replace and remove functionality
- File validation (size, type)
- Optional client-side compression
- Accessibility features (ARIA labels, keyboard navigation)
- Seamless Supabase Storage integration
- Configurable aspect ratios
- Multiple instances per form support

**Props:**
```typescript
interface ImageUploadProps {
  value?: string | null;           // Current image URL
  onChange: (url: string | null) => void; // Callback when image changes
  bucketName?: string;              // Supabase storage bucket (default: 'images')
  folder?: string;                  // Folder within bucket (default: 'services')
  maxSizeMB?: number;               // Max file size in MB (default: 5)
  disabled?: boolean;               // Disable upload functionality
  aspectRatio?: string;             // CSS aspect ratio (e.g., '16/9', '1/1')
  label?: string;                   // Label text (default: 'Upload Image')
}
```

**Basic Usage:**
```tsx
import { ImageUpload } from '@/components/admin';

const [imageUrl, setImageUrl] = useState<string | null>(null);

<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  folder="services"
  label="Service Image"
  aspectRatio="16/9"
  maxSizeMB={5}
/>
```

**Advanced Example - Multiple Uploads:**
```tsx
<form className="space-y-6">
  {/* Hero banner - 16:9 */}
  <ImageUpload
    value={featuredImage}
    onChange={setFeaturedImage}
    label="Featured Image"
    aspectRatio="16/9"
    folder="featured"
  />
  
  {/* Thumbnail - 4:3 */}
  <ImageUpload
    value={thumbnailImage}
    onChange={setThumbnailImage}
    label="Thumbnail"
    aspectRatio="4/3"
    folder="thumbnails"
    maxSizeMB={2}
  />
  
  {/* Profile - 1:1 */}
  <ImageUpload
    value={profileImage}
    onChange={setProfileImage}
    label="Profile Picture"
    aspectRatio="1/1"
    folder="profiles"
  />
</form>
```

**Aspect Ratio Guidelines:**
- `16/9` - Hero images, banners, featured content
- `4/3` - General content images, thumbnails
- `1/1` - Profile pictures, icons, logos
- `3/2` - Gallery images, product photos
- Custom ratios like `21/9` for ultra-wide banners

**File Validation:**
- Automatically validates file type (images only)
- Checks file size against maxSizeMB limit
- Shows user-friendly error messages via toast notifications
- Prevents upload if validation fails

**Upload States:**
- `idle` - Default state, ready to upload
- `uploading` - Shows progress bar and spinner
- `success` - Brief success indicator with checkmark
- `error` - Error indicator with retry option

**Keyboard Accessibility:**
- `Enter` or `Space` - Open file picker
- Fully navigable with keyboard
- Screen reader friendly with ARIA labels

**Supabase Storage Integration:**
The component uses the utility functions from `@/lib/imageUpload.ts`:
- `uploadImageToSupabase()` - Handles file upload
- `deleteImageFromSupabase()` - Handles file deletion
- Automatic unique filename generation
- Public URL retrieval

**Storage Bucket Setup:**
Ensure your Supabase storage bucket exists:
```sql
-- Create bucket if needed
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true);

-- Set up RLS policies
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
```

See `ImageUpload.stories.tsx` for more comprehensive examples including:
- Basic usage
- Different aspect ratios
- Large file sizes
- Disabled state
- Multiple uploads in forms
- Pre-loaded images

## Component Exports

All admin components are exported from `src/components/admin/index.ts`:

```tsx
export { DashboardLayout } from './DashboardLayout';
export { AdminSidebar } from './Sidebar';
export { TopBar } from './TopBar';
export { ContactDetailsForm } from './ContactDetailsForm';
export { LeadsManagement } from './LeadsManagement';
export { ServicesManagement } from './ServicesManagement';
export { ImageUpload } from './ImageUpload';
```

Import any component like:
```tsx
import { ServicesManagement, ImageUpload } from '@/components/admin';
```
