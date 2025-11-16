import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceGallery from '@/components/ServiceGallery';
import ReviewsSection from '@/components/ReviewsSection';
import ServiceFAQ from '@/components/ServiceFAQ';
import QuoteModal from '@/components/QuoteModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Phone, Mail, ChevronRight } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { Link } from 'react-router-dom';

interface Service {
  id: string;
  title: string;
  heading: string;
  sub_heading?: string;
  content: string;
  slug: string;
  service_image_url?: string;
  youtube_video_url?: string;
  benefits?: string | null;
}

const ServicePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [businessPhone, setBusinessPhone] = useState('(555) 123-4567');

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      // Fetch service and business info in parallel
      const [serviceResult, businessResult] = await Promise.all([
        supabase
          .from('services')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single(),
        supabase
          .from('business_info')
          .select('phone')
          .single()
      ]);

      if (serviceResult.error || !serviceResult.data) {
        navigate('/404');
      } else {
        setService(serviceResult.data);
      }

      if (businessResult.data?.phone) {
        setBusinessPhone(businessResult.data.phone);
      }

      setLoading(false);
    };

    fetchData();
  }, [slug, navigate]);

  // Compute SEO values based on service data
  const seoValues = useMemo(() => {
    if (!service) {
      return {
        title: 'Loading Service - Easy House Wash NZ',
        description: 'Professional cleaning services',
        canonical: window.location.href,
        keywords: 'professional cleaning, house cleaning service',
        schema: undefined
      };
    }

    const breadcrumbs = generateBreadcrumbSchema([
      { name: 'Home', url: window.location.origin },
      { name: 'Services', url: `${window.location.origin}/#services` },
      { name: service.title, url: window.location.href }
    ]);

    const serviceSchema = generateServiceSchema({
      name: service.title,
      description: service.sub_heading || service.heading,
      slug: service.slug
    });

    const combinedSchema = {
      "@context": "https://schema.org",
      "@graph": [breadcrumbs, serviceSchema]
    };

    return {
      title: `${service.title} - Easy House Wash NZ Professional Services`,
      description: service.sub_heading || service.heading,
      canonical: `${window.location.origin}/service/${service.slug}`,
      keywords: `${service.title.toLowerCase()}, professional cleaning, house cleaning service, ${service.title.toLowerCase()} near me`,
      schema: combinedSchema
    };
  }, [service]);

  // Call useSEO hook at top level
  useSEO(seoValues);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Breadcrumb Navigation */}
        <nav className="bg-background border-b py-4">
          <div className="container mx-auto px-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <li>
                <a href="/#services" className="text-muted-foreground hover:text-primary transition-colors">
                  Services
                </a>
              </li>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <li>
                <span className="text-foreground font-medium">{service.title}</span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-hero-gradient text-white py-12 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            {/* Back button - hidden on mobile */}
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="hidden md:flex mb-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  {service.heading}
                </h1>
                {service.sub_heading && (
                  <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
                    {service.sub_heading}
                  </p>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="text-lg px-8"
                    onClick={() => setIsQuoteModalOpen(true)}
                  >
                    Get Free Quote
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call {businessPhone}
                  </Button>
                </div>
              </div>

              {service.service_image_url && (
                <div className="relative rounded-2xl overflow-hidden shadow-trust">
                  <img
                    src={service.service_image_url}
                    alt={`${service.title} - Professional cleaning service demonstration`}
                    className="w-full h-[400px] object-cover"
                    loading="eager"
                    width="600"
                    height="400"
                  />
                </div>
              )}
            </div>

            {/* Mobile Layout - Reordered */}
            <div className="lg:hidden space-y-6">
              {/* 1. Heading */}
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {service.heading}
              </h1>
              
              {/* 2. Sub Heading */}
              {service.sub_heading && (
                <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                  {service.sub_heading}
                </p>
              )}
              
              {/* 3. Service Image - 4:3 ratio */}
              {service.service_image_url && (
                <div className="relative rounded-2xl overflow-hidden shadow-trust aspect-[4/3]">
                  <img
                    src={service.service_image_url}
                    alt={`${service.title} - Professional cleaning service demonstration`}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              )}
              
              {/* 4. CTA Buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8 w-full"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  Get Free Quote
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20 w-full"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call {businessPhone}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* YouTube Video Section (if available) */}
        {service.youtube_video_url && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    See Our {service.title} in Action
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Watch how we transform spaces with professional care and attention to detail
                  </p>
                </div>
                
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-elegant">
                  <iframe
                    width="100%"
                    height="100%"
                    src={service.youtube_video_url.replace('watch?v=', 'embed/')}
                    title={`${service.title} Video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Service Description & Inclusions */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Service Description */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  About Our {service.title}
                </h2>
                <div 
                  className="prose prose-lg max-w-none text-muted-foreground leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{ __html: service.content }}
                />
                
                
              </div>

              {/* Service Benefits */}
              <div>
                <Card className="shadow-elegant sticky top-8 bg-[hsl(var(--secondary))] border-primary">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-6 text-center">
                      THE BENEFITS OF {service.title.toUpperCase()}
                    </h3>
                    <div className="space-y-3 mb-8 text-lg">
                        {service.benefits ? (
                          typeof service.benefits === 'string' ? (
                            (() => {
                              // Remove Quill-specific classes (e.g. ql-indent-1) so native list markers render
                              const sanitized = service.benefits
                                .replace(/ql-indent-\d+/g, '')
                                .replace(/class=("|')\s*("|')/g, '')
                                .replace(/class=("|')\s*(?=\s)/g, '');

                              return (
                                <div
                                  className="prose text-muted-foreground [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6"
                                  dangerouslySetInnerHTML={{ __html: sanitized }}
                                />
                              );
                            })()
                          ) : (
                            <div className="text-muted-foreground italic">No benefits listed for this service yet.</div>
                          )
                        ) : (
                          <div className="text-muted-foreground italic">No benefits listed for this service yet.</div>
                        )}
                    </div>
                    
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4 text-center">Ready to Get Started?</h4>
                      <div className="space-y-3">
                        <Button 
                          className="w-full" 
                          size="lg"
                          onClick={() => setIsQuoteModalOpen(true)}
                        >
                          Get Free Quote
                        </Button>
                        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {businessPhone}
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            info@easyhousewash.co.nz
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Before & After Gallery */}
        <ServiceGallery serviceName={service.title} serviceId={service.id} />

        {/* Google Reviews Section */}
        <ReviewsSection />

  {/* FAQ Section */}
  <ServiceFAQ serviceName={service.title} serviceId={service.id} />

        {/* Final CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Experience Our {service.title}?
              </h2>
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                Join hundreds of satisfied customers who trust Easy House Wash NZ for their exterior cleaning needs. 
                Get your free quote today and see the difference professional cleaning makes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  Get Free Quote
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call {businessPhone}
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Professional Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>100% Satisfaction Guaranteed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Eco-Friendly Products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Free Estimates</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Quote Modal */}
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)}
        serviceName={service.title}
      />
    </div>
  );
};

export default ServicePage;