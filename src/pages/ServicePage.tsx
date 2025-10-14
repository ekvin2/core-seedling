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
}

const ServicePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        navigate('/404');
      } else {
        setService(data);
      }
      setLoading(false);
    };

    fetchService();
  }, [slug, navigate]);

  // Compute SEO values based on service data
  const seoValues = useMemo(() => {
    if (!service) {
      return {
        title: 'Loading Service - SparkleClean',
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
      title: `${service.title} - SparkleClean Professional Cleaning Services`,
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

  // Service inclusions/benefits - would be customized per service
  const serviceInclusions = [
    "Professional deep cleaning of all surfaces",
    "Eco-friendly, non-toxic cleaning products",
    "Detailed bathroom and kitchen sanitization",
    "Dusting of all furniture and fixtures",
    "Vacuuming and mopping of all floors",
    "Window sill and baseboard cleaning",
    "Trash removal and fresh liner placement",
    "Final walkthrough quality check"
  ];

  const serviceBenefits = [
    "Healthier living environment",
    "More time for what matters most",
    "Professional-grade cleaning results",
    "Reduced allergens and bacteria",
    "Enhanced home appearance",
    "Stress-free maintenance"
  ];

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
        <section className="bg-hero-gradient text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mb-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                    Call (555) 123-4567
                  </Button>
                </div>
              </div>

              {/* Service Image */}
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
                
                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-2" />
                      Key Benefits
                    </h3>
                    <ul className="space-y-2">
                      {serviceBenefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Service Inclusions */}
              <div>
                <Card className="shadow-elegant sticky top-8">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-6">What's Included</h3>
                    <ul className="space-y-3 mb-8">
                      {serviceInclusions.map((inclusion, index) => (
                        <li key={index} className="flex items-start text-muted-foreground">
                          <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                          {inclusion}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Ready to Get Started?</h4>
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
                            (555) 123-4567
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            info@sparkleclean.com
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
        <ServiceGallery serviceName={service.title} />

        {/* Google Reviews Section */}
        <ReviewsSection />

        {/* FAQ Section */}
        <ServiceFAQ serviceName={service.title} />

        {/* Final CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Experience Our {service.title}?
              </h2>
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                Join hundreds of satisfied customers who trust SparkleClean for their cleaning needs. 
                Get your free quote today and see the difference professional cleaning makes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  Get Free Quote Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call (555) 123-4567
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Licensed & Insured</span>
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