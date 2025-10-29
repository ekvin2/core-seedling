import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, Plus, Loader2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface Service {
  id: string;
  title: string;
}

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  service_id?: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export function ReviewsManagement() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  // Form / modal state
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmReviewId, setConfirmReviewId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
    fetchReviews();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('id, title')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: 'Error fetching services', description: error.message, variant: 'destructive' });
    } else {
      setServices((data as Service[]) || []);
    }
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching reviews', description: error.message, variant: 'destructive' });
    } else {
      setReviews((data as Review[]) || []);
    }
  };

  const resetForm = () => {
    setEditingReview(null);
    setCustomerName('');
    setRating(5);
    setReviewText('');
    setSelectedServiceId('');
    setIsFeatured(false);
  };

  const handleEdit = (r: Review) => {
    setEditingReview(r);
    setCustomerName(r.customer_name);
    setRating(r.rating);
    setReviewText(r.review_text);
    setSelectedServiceId(r.service_id || '');
    setIsFeatured(r.is_featured);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      customer_name: customerName,
      rating,
      review_text: reviewText,
      service_id: selectedServiceId || null,
      is_featured: isFeatured,
      is_active: true,
    } as any;

    try {
      let error = null as any;
      if (editingReview) {
        const res = await supabase.from('reviews').update(data).eq('id', editingReview.id);
        error = res.error;
      } else {
        const res = await supabase.from('reviews').insert([data]);
        error = res.error;
      }

      if (error) {
        toast({ title: 'Error saving review', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: `Review ${editingReview ? 'updated' : 'created'} successfully!` });
        resetForm();
        setIsModalOpen(false);
        fetchReviews();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmReviewId(id);
    setIsConfirmOpen(true);
  };

  const performDeleteConfirmed = async () => {
    if (!confirmReviewId) return;
    const { error } = await supabase.from('reviews').delete().eq('id', confirmReviewId);
    if (error) {
      toast({ title: 'Error deleting review', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Review deleted successfully!' });
      fetchReviews();
    }
    setIsConfirmOpen(false);
    setConfirmReviewId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground">Manage customer reviews and feedback</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Review
        </Button>
      </div>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <CardDescription>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} total</CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Loader2 className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">Get started by creating your first customer review.</p>
              <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Review
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.customer_name}</TableCell>
                      <TableCell>
                        <div className="flex">{[...Array(review.rating)].map((_, i) => (<span key={i} className="text-yellow-400">★</span>))}</div>
                      </TableCell>
                      <TableCell className="max-w-md truncate">{review.review_text}</TableCell>
                      <TableCell>{review.is_featured && (<span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Featured</span>)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(review)}><Edit className="w-4 h-4" /></Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(review.id)}><Trash2 className="w-4 h-4" /></Button>
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
        title="Delete review?"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={performDeleteConfirmed}
        onCancel={() => { setIsConfirmOpen(false); setConfirmReviewId(null); }}
      />

      {/* Add/Edit Modal - use Dialog like Services */}
      <Dialog open={isModalOpen} onOpenChange={() => { setIsModalOpen(false); resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingReview ? 'Edit Review' : 'Create Review'}</DialogTitle>
            <DialogDescription>
              {editingReview ? 'Update the review details below.' : 'Fill in the details to create a new review.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input id="rating" type="number" min={1} max={5} value={rating} onChange={(e) => setRating(parseInt(e.target.value || '5'))} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewText">Review Text</Label>
              <Textarea id="reviewText" value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Enter the review text..." className="min-h-[120px]" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serviceId">Related Service (Optional)</Label>
                <select id="serviceId" value={selectedServiceId} onChange={(e) => setSelectedServiceId(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option value="">-- None --</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isFeatured" className="flex items-center space-x-2">
                  <input id="isFeatured" type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded border-input" />
                  <span>Featured Review</span>
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : (editingReview ? 'Update Review' : 'Create Review')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ReviewsManagement;
