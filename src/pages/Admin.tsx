import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { ContactDetailsForm } from '@/components/admin/ContactDetailsForm';
import { LeadsManagement } from '@/components/admin/LeadsManagement';
import { ServicesManagement } from '@/components/admin/ServicesManagement';
import { PortfolioManagement } from '@/components/admin/PortfolioManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Edit, Eye, ArrowUp, ArrowDown, HelpCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ReviewsManagement } from '@/components/admin/ReviewsManagement';
import { uploadImageToSupabase, deleteImageFromSupabase } from '@/lib/imageUpload';

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
  updated_at?: string;
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

interface FAQ {
  id: string;
  service_id?: string | null;
  question: string;
  answer: string;
  display_order?: number;
  is_general: boolean;
  is_active: boolean;
  created_at: string;
}


const Admin = () => {
  // Portfolio modal state
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  
  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Service form state
  const [title, setTitle] = useState('');
  const [heading, setHeading] = useState('');
  const [subHeading, setSubHeading] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [serviceImageUrl, setServiceImageUrl] = useState('');
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');

  // Portfolio state
  type PortfolioItem = {
    id: string;
    service_id: string | null;
    image_url: string;
    title: string | null;
    taken_at: string; // ISO date
    created_at: string;
  };
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioServiceId, setPortfolioServiceId] = useState('');
  const [portfolioDate, setPortfolioDate] = useState('');
  const [portfolioImage, setPortfolioImage] = useState<File | null>(null);
  const [portfolioImagePreview, setPortfolioImagePreview] = useState('');
  const portfolioFileRef = useRef<HTMLInputElement>(null);

  // Review form state
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // FAQ form state
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqServiceId, setFaqServiceId] = useState('');
  const [isGeneral, setIsGeneral] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      // Batch all initial data fetches for better performance
      Promise.all([
        fetchServices(),
        fetchReviews(),
        fetchFaqs(),
        fetchPortfolio()
      ]);
    }
  }, [isAdmin]);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error fetching services",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setServices(data || []);
    }
  };

  // Portfolio functions
  const fetchPortfolio = async () => {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error fetching portfolio', description: error.message, variant: 'destructive' });
    } else {
      setPortfolio((data as any) || []);
    }
  };

  const handlePortfolioImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file type', description: 'Please select an image file.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please reduce the image size below 5MB and re-upload.', variant: 'destructive' });
      return;
    }
    setPortfolioImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPortfolioImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl: string | null = null;
      if (portfolioImage) {
        const result = await uploadImageToSupabase(portfolioImage, 'images', 'portfolio');
        if (!result.success || !result.url) {
          toast({ title: 'Upload failed', description: result.error || 'Failed to upload image', variant: 'destructive' });
          setLoading(false);
          return;
        }
        imageUrl = result.url;
      } else {
        toast({ title: 'Image required', description: 'Please select an image for the portfolio item.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('portfolio').insert([
        {
          service_id: portfolioServiceId || null,
          image_url: imageUrl,
          title: portfolioTitle || null,
          taken_at: portfolioDate, // expect YYYY-MM-DD
          is_active: true,
        } as any,
      ]);
      if (error) {
        toast({ title: 'Error saving portfolio', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Portfolio item created.' });
        setPortfolioTitle('');
        setPortfolioServiceId('');
        setPortfolioDate('');
        setPortfolioImage(null);
        setPortfolioImagePreview('');
        if (portfolioFileRef.current) portfolioFileRef.current.value = '';
        fetchPortfolio();
      }
    } finally {
      setLoading(false);
    }
  };

  const [isConfirmPortfolioOpen, setIsConfirmPortfolioOpen] = useState(false);
  const [confirmPortfolioId, setConfirmPortfolioId] = useState<string | null>(null);

  const handleDeletePortfolio = (id: string) => {
    setConfirmPortfolioId(id);
    setIsConfirmPortfolioOpen(true);
  };

  const performDeletePortfolioConfirmed = async () => {
    if (!confirmPortfolioId) return;
    try {
      console.log('[portfolio] attempting delete', { id: confirmPortfolioId });
      const session = await supabase.auth.getSession();
      console.log('[auth] session for delete', session?.data?.session ?? null);

      const { data, error } = await supabase.from('portfolio').delete().eq('id', confirmPortfolioId).select();
      console.log('[portfolio] delete result', { data, error });
      if (error) {
        toast({ title: 'Error deleting', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Deleted', description: 'Portfolio item removed.' });
        fetchPortfolio();
      }
    } catch (err: any) {
      console.error('[portfolio] delete thrown', err);
      toast({ title: 'Error deleting', description: String(err?.message ?? err), variant: 'destructive' });
    } finally {
      setIsConfirmPortfolioOpen(false);
      setConfirmPortfolioId(null);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Ensure image is uploaded (if a new file is selected)
    const uploadedUrl = await ensureImageUploaded();
    if (selectedImage && !uploadedUrl) {
      setLoading(false);
      return; // stop submission if upload failed
    }

    const serviceData = {
      title,
      heading,
      sub_heading: subHeading || null,
      content,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      service_image_url: uploadedUrl || serviceImageUrl || null,
      youtube_video_url: youtubeVideoUrl || null,
      is_active: true
    };

    let error;
    if (editingService) {
      const { error: updateError } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', editingService.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('services')
        .insert([serviceData]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error saving service",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Service ${editingService ? 'updated' : 'created'} successfully!`,
      });
      resetForm();
      fetchServices();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setHeading('');
    setSubHeading('');
    setContent('');
    setSlug('');
    setServiceImageUrl('');
    setYoutubeVideoUrl('');
    setEditingService(null);
    setSelectedImage(null);
    setImagePreview('');
  };

  // Image upload functions
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image just-in-time during form submit
  const ensureImageUploaded = async (): Promise<string | null> => {
    if (!selectedImage) return serviceImageUrl || null;
    setUploadingImage(true);
    try {
      const result = await uploadImageToSupabase(selectedImage);
      if (result.success && result.url) {
        setServiceImageUrl(result.url);
        return result.url;
      }
      toast({
        title: "Upload failed",
        description: result.error || "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (serviceImageUrl) {
      // Try to delete from Supabase storage
      await deleteImageFromSupabase(serviceImageUrl);
    }
    
    setServiceImageUrl('');
    setSelectedImage(null);
    setImagePreview('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setHeading(service.heading);
    setSubHeading(service.sub_heading || '');
    setContent(service.content);
    setSlug(service.slug);
    setServiceImageUrl(service.service_image_url || '');
    setYoutubeVideoUrl(service.youtube_video_url || '');
    
    // Set image preview if there's an existing image
    if (service.service_image_url) {
      setImagePreview(service.service_image_url);
    } else {
      setImagePreview('');
    }
    setSelectedImage(null);
  };

  const [isConfirmServiceOpen, setIsConfirmServiceOpen] = useState(false);
  const [confirmServiceId, setConfirmServiceId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setConfirmServiceId(id);
    setIsConfirmServiceOpen(true);
  };

  const performDeleteServiceConfirmed = async () => {
    if (!confirmServiceId) return;
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', confirmServiceId);

    if (error) {
      toast({
        title: "Error deleting service",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Service deleted successfully!",
      });
      fetchServices();
    }

    setIsConfirmServiceOpen(false);
    setConfirmServiceId(null);
  };

  const handleMoveUp = async (service: Service, index: number) => {
    if (index === 0) return;
    
    const prevService = services[index - 1];
    const currentOrder = service.display_order ?? index;
    const prevOrder = prevService.display_order ?? (index - 1);
    
    const { error } = await supabase
      .from('services')
      .update({ display_order: prevOrder } as any)
      .eq('id', service.id);
    
    if (!error) {
      await supabase
        .from('services')
        .update({ display_order: currentOrder } as any)
        .eq('id', prevService.id);
      
      fetchServices();
      toast({
        title: "Success",
        description: "Service order updated!",
      });
    } else {
      toast({
        title: "Error",
        description: "Please add display_order column via Cloud UI",
        variant: "destructive",
      });
    }
  };

  const handleMoveDown = async (service: Service, index: number) => {
    if (index === services.length - 1) return;
    
    const nextService = services[index + 1];
    const currentOrder = service.display_order ?? index;
    const nextOrder = nextService.display_order ?? (index + 1);
    
    const { error } = await supabase
      .from('services')
      .update({ display_order: nextOrder } as any)
      .eq('id', service.id);
    
    if (!error) {
      await supabase
        .from('services')
        .update({ display_order: currentOrder } as any)
        .eq('id', nextService.id);
      
      fetchServices();
      toast({
        title: "Success",
        description: "Service order updated!",
      });
    } else {
      toast({
        title: "Error",
        description: "Please add display_order column via Cloud UI",
        variant: "destructive",
      });
    }
  };

  // Reviews management functions
  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching reviews",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setReviews(data || []);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const reviewData = {
      customer_name: customerName,
      rating,
      review_text: reviewText,
      service_id: selectedServiceId || null,
      is_featured: isFeatured,
      is_active: true
    };

    let error;
    if (editingReview) {
      const { error: updateError } = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('id', editingReview.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('reviews')
        .insert([reviewData]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error saving review",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Review ${editingReview ? 'updated' : 'created'} successfully!`,
      });
      resetReviewForm();
      fetchReviews();
    }
    setLoading(false);
  };

  const resetReviewForm = () => {
    setCustomerName('');
    setRating(5);
    setReviewText('');
    setSelectedServiceId('');
    setIsFeatured(false);
    setEditingReview(null);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setCustomerName(review.customer_name);
    setRating(review.rating);
    setReviewText(review.review_text);
    setSelectedServiceId(review.service_id || '');
    setIsFeatured(review.is_featured);
  };

  const [isConfirmReviewOpen, setIsConfirmReviewOpen] = useState(false);
  const [confirmReviewId, setConfirmReviewId] = useState<string | null>(null);

  const handleDeleteReview = (id: string) => {
    setConfirmReviewId(id);
    setIsConfirmReviewOpen(true);
  };

  const performDeleteReviewConfirmed = async () => {
    if (!confirmReviewId) return;
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', confirmReviewId);

    if (error) {
      toast({
        title: "Error deleting review",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Review deleted successfully!",
      });
      fetchReviews();
    }

    setIsConfirmReviewOpen(false);
    setConfirmReviewId(null);
  };

  // FAQ management functions
  const fetchFaqs = async () => {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error fetching FAQs",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setFaqs(data || []);
    }
  };

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const faqData = {
      question: faqQuestion,
      answer: faqAnswer,
      service_id: faqServiceId || null,
      is_general: isGeneral,
      is_active: true
    };

    let error;
    if (editingFaq) {
      const { error: updateError } = await supabase
        .from('faqs')
        .update(faqData)
        .eq('id', editingFaq.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('faqs')
        .insert([faqData]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error saving FAQ",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `FAQ ${editingFaq ? 'updated' : 'created'} successfully!`,
      });
      resetFaqForm();
      setIsFaqModalOpen(false);
      fetchFaqs();
    }
    setLoading(false);
  };

  const resetFaqForm = () => {
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqServiceId('');
    setIsGeneral(false);
    setEditingFaq(null);
  };

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setFaqServiceId(faq.service_id || '');
    setIsGeneral(faq.is_general);
    setIsFaqModalOpen(true);
  };

  const [isConfirmFaqOpen, setIsConfirmFaqOpen] = useState(false);
  const [confirmFaqId, setConfirmFaqId] = useState<string | null>(null);

  const handleDeleteFaq = (id: string) => {
    setConfirmFaqId(id);
    setIsConfirmFaqOpen(true);
  };

  const performDeleteFaqConfirmed = async () => {
    if (!confirmFaqId) return;

    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', confirmFaqId);

    if (error) {
      toast({
        title: "Error deleting FAQ",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "FAQ deleted successfully!",
      });
      fetchFaqs();
    }

    setIsConfirmFaqOpen(false);
    setConfirmFaqId(null);
  };


  const location = useLocation();
  // Default active tab should be 'leads' per new admin ordering
  const currentTab = location.hash.replace('#', '') || 'leads';
  
  // Map tab values to dashboard sections
  const getSectionFromTab = (tab: string) => {
    const sectionMap: Record<string, 'services' | 'reviews' | 'bookings' | 'clients' | 'settings' | 'contact' | 'leads' | 'faqs' | 'portfolio'> = {
      'services': 'services',
      'reviews': 'reviews',
      'leads': 'leads',
      'contact': 'contact',
      'faqs': 'faqs',
      'portfolio': 'portfolio',
    };
    return sectionMap[tab] || 'leads';
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <DashboardLayout currentSection={getSectionFromTab(currentTab)}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          
          <Button variant="outline" onClick={() => navigate('/')}>
            <Eye className="w-4 h-4 mr-2" />
            View Site
          </Button>
        </div>

        <Tabs value={currentTab} onValueChange={(value) => navigate(`/admin#${value}`)} className="w-full">
          
          
          <TabsContent value="services" className="space-y-6">
            <ServicesManagement />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioManagement />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <ReviewsManagement />
          </TabsContent>

          <TabsContent value="faqs" className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">General FAQs</h2>
                <p className="text-muted-foreground">Manage general FAQs that appear site-wide</p>
              </div>
              <Button onClick={() => { resetFaqForm(); setIsGeneral(true); setIsFaqModalOpen(true); }} size="lg">
                Create General FAQ
              </Button>
            </div>

            {/* Manage General FAQs */}
            <Card>
              <CardHeader>
                <CardTitle>General FAQs</CardTitle>
                <CardDescription>
                  {faqs.filter(f => f.is_general || !f.service_id).length} general {faqs.filter(f => f.is_general || !f.service_id).length === 1 ? 'FAQ' : 'FAQs'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {faqs.filter(f => f.is_general || !f.service_id).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-6 mb-4">
                      <HelpCircle className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No general FAQs yet</h3>
                    <p className="text-muted-foreground mb-4 max-w-sm">
                      Create general FAQs that appear across your website. For service-specific FAQs, edit the service in the Services tab.
                    </p>
                    <Button onClick={() => { resetFaqForm(); setIsGeneral(true); setIsFaqModalOpen(true); }}>
                      Create General FAQ
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Question</TableHead>
                          <TableHead>Answer</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {faqs.filter(f => f.is_general || !f.service_id).map((faq) => (
                          <TableRow key={faq.id}>
                            <TableCell className="font-medium max-w-xs">
                              <div className="line-clamp-2">{faq.question}</div>
                            </TableCell>
                            <TableCell className="max-w-md text-muted-foreground">
                              <div className="line-clamp-2">{faq.answer}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditFaq(faq)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteFaq(faq.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
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

            {/* General FAQ Dialog */}
            <Dialog open={isFaqModalOpen} onOpenChange={() => { setIsFaqModalOpen(false); resetFaqForm(); }}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingFaq ? 'Edit General FAQ' : 'Create General FAQ'}</DialogTitle>
                  <DialogDescription>
                    {editingFaq ? 'Update the general FAQ details.' : 'Create a new general FAQ that appears site-wide.'}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleFaqSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="faqQuestion">Question</Label>
                    <Input
                      id="faqQuestion"
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      placeholder="e.g. What areas do you serve?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="faqAnswer">Answer</Label>
                    <Textarea
                      id="faqAnswer"
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      placeholder="Enter the answer..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => { setIsFaqModalOpen(false); resetFaqForm(); }} disabled={loading}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : (editingFaq ? 'Update FAQ' : 'Create FAQ')}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <LeadsManagement />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <ContactDetailsForm />
          </TabsContent>
        </Tabs>
        {/* Confirmation dialogs for destructive actions */}
        <ConfirmDialog
          open={isConfirmServiceOpen}
          title="Delete service?"
          description="This will permanently delete the service and related content."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={performDeleteServiceConfirmed}
          onCancel={() => { setIsConfirmServiceOpen(false); setConfirmServiceId(null); }}
        />

        <ConfirmDialog
          open={isConfirmPortfolioOpen}
          title="Delete portfolio item?"
          description="This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={performDeletePortfolioConfirmed}
          onCancel={() => { setIsConfirmPortfolioOpen(false); setConfirmPortfolioId(null); }}
        />

        <ConfirmDialog
          open={isConfirmReviewOpen}
          title="Delete review?"
          description="Are you sure you want to delete this review?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={performDeleteReviewConfirmed}
          onCancel={() => { setIsConfirmReviewOpen(false); setConfirmReviewId(null); }}
        />

        <ConfirmDialog
          open={isConfirmFaqOpen}
          title="Delete FAQ?"
          description="Are you sure you want to delete this FAQ?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={performDeleteFaqConfirmed}
          onCancel={() => { setIsConfirmFaqOpen(false); setConfirmFaqId(null); }}
        />
      </div>
    </DashboardLayout>
  );
};

export default Admin;