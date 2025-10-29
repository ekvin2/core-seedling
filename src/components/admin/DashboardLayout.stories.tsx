/**
 * DashboardLayout Storybook Examples
 * 
 * This file demonstrates various states and configurations of the admin dashboard layout.
 * Use these examples as a reference for implementing the layout in different scenarios.
 */

import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Example 1: Basic Dashboard View
 * Shows the default dashboard with sample content
 */
export function BasicDashboard() {
  return (
  <DashboardLayout currentSection="leads">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your cleaning services admin panel
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Total Services', value: '12', change: '+2 this month' },
            { title: 'Reviews', value: '48', change: '+8 this week' },
            { title: 'Bookings', value: '124', change: '+18 today' },
            { title: 'Active Clients', value: '89', change: '+5 this month' },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * Example 2: Services Management View
 * Shows the services section with action buttons
 */
export function ServicesView() {
  return (
    <DashboardLayout currentSection="services">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services</h1>
            <p className="text-muted-foreground">
              Manage your cleaning service offerings
            </p>
          </div>
          <Button>Add New Service</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service List</CardTitle>
            <CardDescription>
              View and manage all your services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Service management content goes here...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

/**
 * Example 3: Reviews Section
 * Shows the reviews management interface
 */
export function ReviewsView() {
  return (
    <DashboardLayout currentSection="reviews">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
            <p className="text-muted-foreground">
              Manage customer reviews and testimonials
            </p>
          </div>
          <Button>Add Review</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              Recent feedback from your clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Reviews content goes here...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

/**
 * Example 4: Settings Page
 * Shows the settings section
 */
export function SettingsView() {
  return (
    <DashboardLayout currentSection="settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your admin panel preferences
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your account and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings options...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * Example 5: Empty State
 * Shows how the layout handles empty content
 */
export function EmptyState() {
  return (
    <DashboardLayout currentSection="bookings">
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">No bookings yet</h2>
          <p className="text-muted-foreground">
            Get started by creating your first booking
          </p>
        </div>
        <Button>Create Booking</Button>
      </div>
    </DashboardLayout>
  );
}

/**
 * Example 6: Loading State
 * Shows skeleton loaders in the layout
 */
export function LoadingState() {
  return (
  <DashboardLayout currentSection="leads">
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse bg-muted rounded" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 w-24 animate-pulse bg-muted rounded" />
                  <div className="h-8 w-16 animate-pulse bg-muted rounded" />
                  <div className="h-3 w-32 animate-pulse bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * Usage Notes:
 * 
 * 1. The DashboardLayout automatically handles:
 *    - Responsive sidebar collapse
 *    - Active route highlighting
 *    - User authentication display
 *    - Keyboard navigation
 * 
 * 2. To use in your pages:
 *    ```tsx
 *    import { DashboardLayout } from '@/components/admin/DashboardLayout';
 *    
 *    export function MyAdminPage() {
 *      return (
 *        <DashboardLayout currentSection="services">
 *          <YourContent />
 *        </DashboardLayout>
 *      );
 *    }
 *    ```
 * 
 * 3. Available sections:
 *    - 'dashboard' - Main overview
 *    - 'services' - Service management
 *    - 'reviews' - Review management
 *    - 'bookings' - Booking management (coming soon)
 *    - 'clients' - Client management (coming soon)
 *    - 'settings' - Settings page
 * 
 * 4. The layout is fully responsive:
 *    - Mobile: Collapsed sidebar by default
 *    - Tablet: Expandable sidebar
 *    - Desktop: Full sidebar visible
 */
