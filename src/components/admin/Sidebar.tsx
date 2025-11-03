import { NavLink } from 'react-router-dom';
import {
  Briefcase,
  Star,
  Calendar,
  Users,
  Settings,
  Sparkles,
  Phone,
  UserCheck,
  Image,
  HelpCircle,
  LayoutDashboard
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface AdminSidebarProps {
  currentSection?: 'services' | 'portfolio' | 'reviews' | 'bookings' | 'clients' | 'settings' | 'contact' | 'leads' | 'faqs';
}

const menuItems: MenuItem[] = [
  {
    title: 'Leads',
    url: '/admin#leads',
    icon: UserCheck
  },
  {
    title: 'Services',
    url: '/admin#services',
    icon: Briefcase
  },
  {
    title: 'Portfolio',
    url: '/admin#portfolio',
    icon: Image
  },
  {
    title: 'Reviews',
    url: '/admin#reviews',
    icon: Star
  },
 
  {
    title: 'Contact Details',
    url: '/admin#contact',
    icon: Phone
  },
  {
    title: 'Bookings',
    url: '/admin#bookings',
    icon: Calendar,
    badge: 'Soon'
  },
];

/**
 * AdminSidebar - Navigation sidebar for admin dashboard
 * 
 * Features:
 * - Active route highlighting
 * - Icon + text labels
 * - Collapsible design
 * - Keyboard accessible
 * - Smooth animations
 */
export function AdminSidebar({ currentSection = 'leads' }: AdminSidebarProps) {
  const { open } = useSidebar();

  const isActive = (url: string) => {
    const hash = url.split('#')[1];
    return hash === currentSection;
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">
                Admin Panel
              </span>
              <span className="text-xs text-muted-foreground">
                Cleaning Services
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <a
                      href={item.url}
                      className="group relative"
                      aria-label={item.title}
                      aria-current={isActive(item.url) ? 'page' : undefined}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {open && (
          <div className="text-xs text-muted-foreground">
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2025 Cleaning Services</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
