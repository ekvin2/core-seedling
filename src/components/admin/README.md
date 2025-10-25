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
