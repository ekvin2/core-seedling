import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { ContactDetailsForm } from '@/components/admin/ContactDetailsForm';
import { LeadsManagement } from '@/components/admin/LeadsManagement';
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

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchServices();
      fetchReviews();
      fetchFaqs();
      fetchPortfolio();
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

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    try {
      console.log('[portfolio] attempting delete', { id });
      // Log current user/session for debugging
      const session = await supabase.auth.getSession();
      console.log('[auth] session for delete', session?.data?.session ?? null);

      const { data, error } = await supabase.from('portfolio').delete().eq('id', id).select();
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

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

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

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
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

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
  };


  const location = useLocation();
  const currentTab = location.hash.replace('#', '') || 'services';
  
  // Map tab values to dashboard sections
  const getSectionFromTab = (tab: string) => {
    const sectionMap: Record<string, 'dashboard' | 'services' | 'reviews' | 'bookings' | 'clients' | 'settings' | 'contact' | 'leads'> = {
      'services': 'services',
      'reviews': 'reviews',
      'leads': 'leads',
      'contact': 'contact',
      'faqs': 'settings',
      'portfolio': 'services',
    };
    return sectionMap[tab] || 'dashboard';
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
            <p className="text-muted-foreground">Manage your cleaning services content</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <Eye className="w-4 h-4 mr-2" />
            View Site
          </Button>
        </div>

        <Tabs value={currentTab} onValueChange={(value) => navigate(`/admin#${value}`)} className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="faqs">Q&A / FAQs</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingService ? 'Edit Service' : 'Create New Service'}</CardTitle>
                <CardDescription>
                  {editingService ? 'Update the service details below' : 'Add a new cleaning service to your website'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Service Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Deep Cleaning"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="e.g. deep-cleaning"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="heading">Main Heading</Label>
                    <Input
                      id="heading"
                      value={heading}
                      onChange={(e) => setHeading(e.target.value)}
                      placeholder="e.g. Professional Deep Cleaning Services"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subHeading">Sub Heading</Label>
                    <Input
                      id="subHeading"
                      value={subHeading}
                      onChange={(e) => setSubHeading(e.target.value)}
                      placeholder="e.g. Thorough cleaning for your entire space"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content (HTML supported)</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter the full service description with HTML formatting..."
                      className="min-h-[200px]"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="serviceImage">Service Image</Label>
                      <div className="space-y-4">
                        {/* File input */}
                        <div className="flex items-center gap-2">
                          <Input
                            ref={fileInputRef}
                            id="serviceImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="flex-1"
                          />
                        </div>
                        
                        {/* Image preview */}
                        {(imagePreview || serviceImageUrl) && (
                          <div className="relative">
                            <img
                              src={imagePreview || serviceImageUrl}
                              alt="Service preview"
                              className="w-full h-48 object-cover rounded-md border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={handleRemoveImage}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        
                        {/* Current image URL display */}
                        {serviceImageUrl && (
                          <div className="text-xs text-muted-foreground">
                            <strong>Current image URL:</strong>
                            <br />
                            <span className="break-all">{serviceImageUrl}</span>
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          Upload an image for the service page hero section. Max size: 5MB
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtubeVideoUrl">YouTube Video URL (Optional)</Label>
                      <Input
                        id="youtubeVideoUrl"
                        value={youtubeVideoUrl}
                        onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                        placeholder="e.g. https://youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional YouTube video to embed on the service page
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : (editingService ? 'Update Service' : 'Create Service')}
                    </Button>
                    {editingService && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manage Services</CardTitle>
                <CardDescription>View, edit, delete, and reorder all services</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Heading</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service, index) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMoveUp(service, index)}
                              disabled={index === 0}
                              className="h-8 w-8 p-0"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMoveDown(service, index)}
                              disabled={index === services.length - 1}
                              className="h-8 w-8 p-0"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{service.title}</TableCell>
                        <TableCell className="text-muted-foreground">/{service.slug}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {service.heading}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/service/${service.slug}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(service)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(service.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {services.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No services found. Create your first service!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Portfolio Item</CardTitle>
                <CardDescription>Add a new portfolio photo with service and date</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePortfolioSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="portfolioTitle">Name (optional)</Label>
                      <Input
                        id="portfolioTitle"
                        value={portfolioTitle}
                        onChange={(e) => setPortfolioTitle(e.target.value)}
                        placeholder="e.g. Roof Wash at Elm St"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolioService">Service</Label>
                      <select
                        id="portfolioService"
                        value={portfolioServiceId}
                        onChange={(e) => setPortfolioServiceId(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="">-- None --</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="portfolioDate">Date</Label>
                      <Input
                        id="portfolioDate"
                        type="date"
                        value={portfolioDate}
                        onChange={(e) => setPortfolioDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolioImage">Image (max 5MB)</Label>
                      <Input
                        ref={portfolioFileRef}
                        id="portfolioImage"
                        type="file"
                        accept="image/*"
                        onChange={handlePortfolioImageSelect}
                        required
                      />
                      {portfolioImagePreview && (
                        <img src={portfolioImagePreview} alt="Preview" className="mt-2 h-40 w-full object-cover rounded border" />
                      )}
                      <p className="text-xs text-muted-foreground">If the image is larger than 5MB, please reduce its size and re-upload.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Item'}</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPortfolioTitle('');
                        setPortfolioServiceId('');
                        setPortfolioDate('');
                        setPortfolioImage(null);
                        setPortfolioImagePreview('');
                        if (portfolioFileRef.current) portfolioFileRef.current.value = '';
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Portfolio</CardTitle>
                <CardDescription>View and delete portfolio items</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Preview</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <img src={item.image_url} alt={item.title || ''} className="h-12 w-20 object-cover rounded border" />
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.service_id ? (services.find(s => s.id === item.service_id)?.title || 'Unknown') : <span className="text-muted-foreground">None</span>}
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate">{item.title || '-'}</TableCell>
                        <TableCell className="text-sm">{new Date(item.taken_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm" onClick={() => handleDeletePortfolio(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {portfolio.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No portfolio items yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingReview ? 'Edit Review' : 'Create New Review'}</CardTitle>
                <CardDescription>
                  {editingReview ? 'Update the review details below' : 'Add a customer review'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (1-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reviewText">Review Text</Label>
                    <Textarea
                      id="reviewText"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Enter the review text..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="serviceId">Related Service (Optional)</Label>
                      <select
                        id="serviceId"
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="">-- None --</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="isFeatured" className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={isFeatured}
                          onChange={(e) => setIsFeatured(e.target.checked)}
                          className="rounded border-input"
                        />
                        <span>Featured Review</span>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : (editingReview ? 'Update Review' : 'Create Review')}
                    </Button>
                    {editingReview && (
                      <Button type="button" variant="outline" onClick={resetReviewForm}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Reviews</CardTitle>
                <CardDescription>View, edit, and delete all customer reviews</CardDescription>
              </CardHeader>
              <CardContent>
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
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md truncate">{review.review_text}</TableCell>
                        <TableCell>
                          {review.is_featured && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditReview(review)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {reviews.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No reviews found. Create your first review!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faqs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
                  </div>
                </CardTitle>
                <CardDescription>
                  {editingFaq ? 'Update the FAQ details below' : 'Add a frequently asked question'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFaqSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="faqQuestion">Question</Label>
                    <Input
                      id="faqQuestion"
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      placeholder="e.g. How long does the service take?"
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="faqServiceId">Related Service (Optional)</Label>
                      <select
                        id="faqServiceId"
                        value={faqServiceId}
                        onChange={(e) => setFaqServiceId(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="">-- General FAQ --</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Leave empty for general FAQs shown on all pages
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="isGeneral" className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isGeneral"
                          checked={isGeneral}
                          onChange={(e) => setIsGeneral(e.target.checked)}
                          className="rounded border-input"
                        />
                        <span>Show on all pages</span>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        General FAQs appear across the website
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : (editingFaq ? 'Update FAQ' : 'Create FAQ')}
                    </Button>
                    {editingFaq && (
                      <Button type="button" variant="outline" onClick={resetFaqForm}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage FAQs</CardTitle>
                <CardDescription>View, edit, and delete all FAQs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Answer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faqs.map((faq) => (
                      <TableRow key={faq.id}>
                        <TableCell className="font-medium max-w-xs truncate">
                          {faq.question}
                        </TableCell>
                        <TableCell className="max-w-md truncate text-muted-foreground">
                          {faq.answer}
                        </TableCell>
                        <TableCell className="text-sm">
                          {faq.service_id ? (
                            services.find(s => s.id === faq.service_id)?.title || 'Unknown'
                          ) : (
                            <span className="text-muted-foreground">General</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {faq.is_general && (
                            <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded">
                              Global
                            </span>
                          )}
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
                {faqs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No FAQs found. Create your first FAQ!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <LeadsManagement />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <ContactDetailsForm />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Admin;