import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from './ImageUpload';
import { ServiceFAQManager } from './ServiceFAQManager';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  PackageOpen,
  Eye,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface Service {
  id: string;
  title: string;
  heading: string;
  sub_heading?: string;
  content: string;
  slug: string;
  is_active: boolean;
  display_order?: number;
  created_at: string;
  featured_image_url?: string | null;
  service_image_url?: string | null;
  youtube_video_url?: string | null;
  benefits?: string[] | null;
  updated_at?: string;
}

type ServiceFormData = Omit<Service, 'id' | 'created_at' | 'updated_at'>;

/**
 * ServicesManagement Component
 * 
 * A modern admin interface for managing cleaning services with:
 * - Modal-based add/edit forms
 * - Inline table view with quick actions
 * - Image upload integration
 * - Loading and empty states
 * - Success/error notifications
 * - Responsive design
 */
export const ServicesManagement: React.FC = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmService, setConfirmService] = useState<Service | null>(null);

  // Form state
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    heading: '',
    sub_heading: '',
    content: '',
    slug: '',
    service_image_url: null,
    featured_image_url: null,
    youtube_video_url: null,
    benefits: null,
    is_active: true,
    display_order: undefined,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching services',
        description: error instanceof Error ? error.message : 'Failed to load services',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      heading: '',
      sub_heading: '',
      content: '',
      slug: '',
      service_image_url: null,
      featured_image_url: null,
      youtube_video_url: null,
      benefits: null,
      is_active: true,
      display_order: undefined,
    });
    setEditingService(null);
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        heading: service.heading,
        sub_heading: service.sub_heading || '',
        content: service.content,
        slug: service.slug,
        service_image_url: service.service_image_url,
        featured_image_url: service.featured_image_url,
        youtube_video_url: service.youtube_video_url || '',
        benefits: service.benefits || null,
        is_active: service.is_active,
        display_order: service.display_order,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(resetForm, 300); // Reset after animation
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.heading.trim() || !formData.content.trim()) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const slug = formData.slug || generateSlug(formData.title);
      const serviceData = {
        ...formData,
        slug,
        sub_heading: formData.sub_heading || null,
        youtube_video_url: formData.youtube_video_url || null,
      };

      if (editingService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Service updated successfully!',
        });
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Service created successfully!',
        });
      }

      handleCloseModal();
      fetchServices();
    } catch (error) {
      toast({
        title: 'Error saving service',
        description: error instanceof Error ? error.message : 'Failed to save service',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (service: Service) => {
    setConfirmService(service);
    setIsConfirmOpen(true);
  };

  const performDeleteConfirmed = async () => {
    if (!confirmService) return;
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', confirmService.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Service deleted successfully!',
      });
      fetchServices();
    } catch (error) {
      toast({
        title: 'Error deleting service',
        description: error instanceof Error ? error.message : 'Failed to delete service',
        variant: 'destructive',
      });
    } finally {
      setIsConfirmOpen(false);
      setConfirmService(null);
    }
  };

  const handleMoveUp = async (service: Service, index: number) => {
    if (index === 0) return;

    const prevService = services[index - 1];
    const currentOrder = service.display_order ?? index;
    const prevOrder = prevService.display_order ?? (index - 1);

    try {
      await supabase.from('services').update({ display_order: prevOrder }).eq('id', service.id);
      await supabase.from('services').update({ display_order: currentOrder }).eq('id', prevService.id);

      toast({
        title: 'Success',
        description: 'Service order updated!',
      });
      fetchServices();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update service order',
        variant: 'destructive',
      });
    }
  };

  const handleMoveDown = async (service: Service, index: number) => {
    if (index === services.length - 1) return;

    const nextService = services[index + 1];
    const currentOrder = service.display_order ?? index;
    const nextOrder = nextService.display_order ?? (index + 1);

    try {
      await supabase.from('services').update({ display_order: nextOrder }).eq('id', service.id);
      await supabase.from('services').update({ display_order: currentOrder }).eq('id', nextService.id);

      toast({
        title: 'Success',
        description: 'Service order updated!',
      });
      fetchServices();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update service order',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', service.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Service ${service.is_active ? 'deactivated' : 'activated'} successfully!`,
      });
      fetchServices();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update service status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">
            Manage your cleaning services and offerings
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>
            {services.length} {services.length === 1 ? 'service' : 'services'} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <PackageOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No services yet</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Get started by creating your first cleaning service offering.
              </p>
              <Button onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Service
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Order</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service, index) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveUp(service, index)}
                            disabled={index === 0}
                            aria-label="Move up"
                            className="h-6 w-6 p-0"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveDown(service, index)}
                            disabled={index === services.length - 1}
                            aria-label="Move down"
                            className="h-6 w-6 p-0"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {service.service_image_url && (
                            <img
                              src={service.service_image_url}
                              alt={service.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{service.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {service.heading}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          /{service.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={service.is_active ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => handleToggleActive(service)}
                        >
                          {service.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(service)}
                            aria-label="Edit service"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(service)}
                            aria-label="Delete service"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

        <ConfirmDialog
          open={isConfirmOpen}
          title={confirmService ? `Delete \"${confirmService.title}\"?` : 'Delete service?'}
          description="This will permanently remove the service and any related content."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={performDeleteConfirmed}
          onCancel={() => { setIsConfirmOpen(false); setConfirmService(null); }}
        />

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? 'Update the service details and manage FAQs.'
                : 'Fill in the details to create a new cleaning service.'}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Service Details</TabsTrigger>
              <TabsTrigger value="faqs" disabled={!editingService}>
                FAQs {!editingService && '(Save service first)'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Service Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Deep House Cleaning"
                      required
                    />
                  </div>

                  {/* Heading */}
                  <div className="space-y-2">
                    <Label htmlFor="heading">
                      Heading <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="heading"
                      value={formData.heading}
                      onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                      placeholder="e.g., Professional Deep Cleaning Services"
                      required
                    />
                  </div>

                  {/* Sub Heading */}
                  <div className="space-y-2">
                    <Label htmlFor="sub_heading">Sub Heading</Label>
                    <Input
                      id="sub_heading"
                      value={formData.sub_heading}
                      onChange={(e) => setFormData({ ...formData, sub_heading: e.target.value })}
                      placeholder="Optional tagline or subtitle"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="Auto-generated from title"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to auto-generate from title
                    </p>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content">
                      Service Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Detailed description of the service..."
                      rows={6}
                      required
                    />
                  </div>

                  {/* Service Image */}
                  <ImageUpload
                    value={formData.service_image_url}
                    onChange={(url) => setFormData({ ...formData, service_image_url: url })}
                    folder="services"
                    label="Service Image"
                    aspectRatio="16/9"
                  />

                  {/* YouTube Video URL */}
                  <div className="space-y-2">
                    <Label htmlFor="youtube_video_url">YouTube Video URL</Label>
                    <Input
                      id="youtube_video_url"
                      value={formData.youtube_video_url || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, youtube_video_url: e.target.value })
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      type="url"
                    />
                  </div>

                  {/* Service Benefits */}
                  <div className="space-y-2">
                    <Label htmlFor="benefits">Service Benefits</Label>
                    <Textarea
                      id="benefits"
                      value={formData.benefits?.join('\n') || ''}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n').filter(line => line.trim());
                        setFormData({ ...formData, benefits: lines.length > 0 ? lines : null });
                      }}
                      placeholder="Enter each benefit on a new line&#10;e.g., Healthier living environment&#10;More time for what matters most&#10;Professional-grade cleaning results"
                      rows={8}
                    />
                    <p className="text-xs text-muted-foreground">
                      Each line will appear as a bullet point in the "Benefits" section
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingService ? 'Update Service' : 'Create Service'}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="faqs" className="mt-6">
              {editingService && (
                <ServiceFAQManager
                  serviceId={editingService.id}
                  serviceName={editingService.title}
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};
