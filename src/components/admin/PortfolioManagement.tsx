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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from './ImageUpload';
import { Plus, Edit2, Trash2, Loader2, PackageOpen } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface Portfolio {
  id: string;
  service_id: string;
  title?: string;
  image_url: string;
  taken_at: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface Service {
  id: string;
  title: string;
}

type PortfolioFormData = Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>;

export const PortfolioManagement: React.FC = () => {
  const { toast } = useToast();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<Portfolio | null>(null);
  const [formData, setFormData] = useState<PortfolioFormData>({
    service_id: '',
    title: '',
    image_url: '',
    taken_at: '',
    is_active: true,
  });

  useEffect(() => {
    fetchServices();
    fetchPortfolios();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('id, title');
    if (!error && data) setServices(data);
  };

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('portfolio').select('*');
      if (error) throw error;
  setPortfolios(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching portfolios',
        description: error instanceof Error ? error.message : 'Failed to load portfolios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      service_id: '',
      title: '',
      image_url: '',
      taken_at: '',
      is_active: true,
    });
    setEditingPortfolio(null);
  };

  const handleOpenModal = (portfolio?: Portfolio) => {
    if (portfolio) {
      setEditingPortfolio(portfolio);
      setFormData({
        service_id: portfolio.service_id,
        title: portfolio.title || '',
        image_url: portfolio.image_url,
        taken_at: portfolio.taken_at,
        is_active: portfolio.is_active,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(resetForm, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service_id.trim() || !formData.image_url.trim() || !formData.taken_at.trim()) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all required fields (service, image, date).',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);
    try {
      if (editingPortfolio) {
        const { error } = await supabase
          .from('portfolio')
          .update(formData)
          .eq('id', editingPortfolio.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Portfolio updated successfully!' });
      } else {
        const { error } = await supabase.from('portfolio').insert([formData]);
        if (error) throw error;
        toast({ title: 'Success', description: 'Portfolio created successfully!' });
      }
      handleCloseModal();
      fetchPortfolios();
    } catch (error) {
      toast({
        title: 'Error saving portfolio',
        description: error instanceof Error ? error.message : 'Failed to save portfolio',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (portfolio: Portfolio) => {
    setConfirmTarget(portfolio);
    setIsConfirmOpen(true);
  };

  const performDeleteConfirmed = async () => {
    if (!confirmTarget) return;
    try {
      const { error } = await supabase.from('portfolio').delete().eq('id', confirmTarget.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Portfolio deleted successfully!' });
      fetchPortfolios();
    } catch (error) {
      toast({
        title: 'Error deleting portfolio',
        description: error instanceof Error ? error.message : 'Failed to delete portfolio',
        variant: 'destructive',
      });
    } finally {
      setIsConfirmOpen(false);
      setConfirmTarget(null);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
          <p className="text-muted-foreground">Manage your portfolio by service</p>
        </div>
  <Button onClick={() => handleOpenModal()} size="lg" variant="default">
          <Plus className="w-4 h-4 mr-2" />
          Create Portfolio
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Portfolio Items</CardTitle>
          <CardDescription>
            {portfolios.length} {portfolios.length === 1 ? 'item' : 'items'} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {portfolios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <PackageOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No portfolio items yet</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Get started by creating your first portfolio item.
              </p>
              <Button onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Portfolio
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolios.map((portfolio) => {
                    const service = services.find((s) => s.id === portfolio.service_id);
                    return (
                      <TableRow key={portfolio.id}>
                        <TableCell>{service ? service.title : 'Unknown'}</TableCell>
                        <TableCell>{portfolio.title}</TableCell>
                        <TableCell>{portfolio.taken_at}</TableCell>
                        <TableCell>
                          {portfolio.image_url && (
                            <img
                              src={portfolio.image_url}
                              alt={portfolio.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={portfolio.is_active ? 'default' : 'secondary'}>
                            {portfolio.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenModal(portfolio)}
                              aria-label="Edit portfolio"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(portfolio)}
                              aria-label="Delete portfolio"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <ConfirmDialog
          open={isConfirmOpen}
          title={confirmTarget ? `Delete \"${confirmTarget.title}\"?` : 'Delete portfolio item?'}
          description="This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={performDeleteConfirmed}
          onCancel={() => { setIsConfirmOpen(false); setConfirmTarget(null); }}
        />
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPortfolio ? 'Edit Portfolio' : 'Add New Portfolio'}
            </DialogTitle>
            <DialogDescription>
              {editingPortfolio
                ? 'Update the portfolio details below.'
                : 'Fill in the details to create a new portfolio item.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_id">Service <span className="text-destructive">*</span></Label>
                <select
                  id="service_id"
                  value={formData.service_id}
                  onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Portfolio Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Modern Apartment Cleaning"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taken_at">Date Taken <span className="text-destructive">*</span></Label>
                <Input
                  id="taken_at"
                  type="date"
                  value={formData.taken_at}
                  onChange={(e) => setFormData({ ...formData, taken_at: e.target.value })}
                  required
                />
              </div>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="portfolio"
                label="Portfolio Image"
                aspectRatio="16/9"
              />
              <div className="space-y-2 flex items-center gap-2">
                <Label htmlFor="is_active">Active</Label>
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingPortfolio ? 'Update Portfolio' : 'Create Portfolio'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
