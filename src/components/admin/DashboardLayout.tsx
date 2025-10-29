import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
  children: ReactNode;
  currentSection?: 'services' | 'reviews' | 'bookings' | 'clients' | 'settings' | 'contact' | 'leads' | 'faqs' | 'portfolio';
}

/**
 * DashboardLayout - Modern admin layout with sidebar navigation and top bar
 * 
 * Features:
 * - Responsive sidebar with collapse/expand
 * - Top bar with user profile and notifications
 * - Full keyboard navigation support
 * - Animated transitions
 * 
 * @example
 * ```tsx
 * <DashboardLayout currentSection="services">
 *   <YourAdminContent />
 * </DashboardLayout>
 * ```
 */
export function DashboardLayout({ children, currentSection = 'leads' }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar currentSection={currentSection} />
        
        <div className="flex-1 flex flex-col">
          <TopBar />
          
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
