import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  heading: string;
  sub_heading?: string;
  content: string;
  slug: string;
  featured_image_url?: string;
  service_image_url?: string;
}

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to get service image URL based on service name/slug
  const getServiceImageUrl = (service: Service) => {
    // First try the existing URLs from database
    if (service.featured_image_url) return service.featured_image_url;
    if (service.service_image_url) return service.service_image_url;
    
    // Fallback to uploaded images saved under service name
    // Convert service title to lowercase and replace spaces with hyphens
    const imageName = service.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `/images/services/${imageName}.jpg`;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try{
        const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

        console.log(error);
        console.log(data);

      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
      }catch($e){
        console.log("this");
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Our Professional Cleaning Services
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              From regular maintenance to deep cleaning, we offer comprehensive solutions 
              tailored to your specific needs and schedule.
            </p>
          </div>
          <div className="text-center">Loading services...</div>
        </div>
      </section>
    );
  }
  return (
    <section id="services" className="py-6 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-4">
        <div className="text-center mb-6 md:mb-16">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">
            Our Professional Cleaning Services
          </h2>
          <p className="text-sm md:text-xl text-muted-foreground max-w-3xl mx-auto px-2 md:px-4">
            From regular maintenance to deep cleaning, we offer comprehensive solutions 
            tailored to your specific needs and schedule.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-16">
          {services.map((service) => (
            <Card 
              key={service.id} 
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 overflow-hidden p-0 h-[200px] md:h-[280px] lg:h-[320px]"
            >
              {/* Image Container - 80% height with 2:1 aspect ratio and dark overlay */}
              <div className="relative h-[80%] overflow-hidden bg-muted aspect-[2/1]">
                <img 
                  src={getServiceImageUrl(service)} 
                  alt={service.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {/* Dark overlay - stronger on mobile for better text contrast */}
                <div className="absolute inset-0 bg-black/50 md:bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
              </div>
              
              {/* Content Container - 20% height, optimized for mobile and desktop */}
              <div className="h-[20%] flex flex-col justify-center items-center bg-background px-2">
                {/* Service Title - Responsive text sizing */}
                <h3 className="text-xs md:text-sm lg:text-base font-semibold text-center mb-1 leading-tight overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                  {service.title}
                </h3>
                {/* Learn More Button - Filled blue button */}
                <Button 
                  onClick={() => navigate(`/service/${service.slug}`)}
                  variant="default"
                  size="sm"
                  className="text-xs md:text-sm px-3 py-1 h-auto min-h-[24px] md:min-h-[28px] bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
                >
                  Learn More
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-4 md:mt-16">
          <div className="bg-subtle-gradient rounded-xl md:rounded-2xl p-4 md:p-8 max-w-4xl mx-auto">
            <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">Why Choose SparkleClean?</h3>
            <div className="grid grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-8">
              <div className="text-center">
                <div className="text-xl md:text-3xl font-bold text-primary mb-1 md:mb-2">5+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Years of Experience</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-3xl font-bold text-primary mb-1 md:mb-2">500+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Satisfied Customers</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-3xl font-bold text-primary mb-1 md:mb-2">100%</div>
                <div className="text-xs md:text-sm text-muted-foreground">Satisfaction Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;