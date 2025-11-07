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
              className="group hover:shadow-card-hover transition-all duration-300 border-border/50 hover:border-primary/40 overflow-hidden bg-background relative"
            >
              {/* Image Container with Gradient Overlay */}
              <div className="relative h-32 md:h-48 overflow-hidden bg-muted">
                <img 
                  src={getServiceImageUrl(service)} 
                  alt={`${service.title} - Professional house cleaning service by Easy House Wash NZ`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width="400"
                  height="300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Content Container */}
              <div className="p-3 md:p-6 flex flex-col items-center text-center space-y-2 md:space-y-4">
                {/* Service Title */}
                <h3 className="text-sm md:text-lg lg:text-xl font-bold line-clamp-2">
                  {service.title}
                </h3>
                {/* Service Description */}
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 md:line-clamp-3">
                  {service.sub_heading || "Professional cleaning service tailored to your needs"}
                </p>
                {/* Arrow Button with Gradient */}
                <button 
                  onClick={() => navigate(`/service/${service.slug}`)}
                  className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-colorful-gradient hover:shadow-vibrant text-primary-foreground flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  aria-label={`Learn more about ${service.title}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-5 md:h-5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-4 md:mt-16">
          <div className="bg-gradient-to-br from-[hsl(217,80%,98%)] via-[hsl(217,70%,96%)] to-[hsl(217,60%,97%)] rounded-xl md:rounded-2xl p-4 md:p-8 max-w-4xl mx-auto shadow-elegant border border-primary/10">
            <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary via-[hsl(217,95%,65%)] to-primary bg-clip-text text-transparent">Why Choose Easy House Wash NZ?</h3>
            <div className="grid grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-8">
              <div className="text-center p-2 md:p-4 rounded-lg bg-white/60 backdrop-blur-sm">
                <div className="text-xl md:text-3xl font-bold bg-gradient-to-br from-primary to-[hsl(217,95%,65%)] bg-clip-text text-transparent mb-1 md:mb-2">5+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Years of Experience</div>
              </div>
              <div className="text-center p-2 md:p-4 rounded-lg bg-white/60 backdrop-blur-sm">
                <div className="text-xl md:text-3xl font-bold bg-gradient-to-br from-primary to-[hsl(217,95%,65%)] bg-clip-text text-transparent mb-1 md:mb-2">500+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Satisfied Customers</div>
              </div>
              <div className="text-center p-2 md:p-4 rounded-lg bg-white/60 backdrop-blur-sm">
                <div className="text-xl md:text-3xl font-bold bg-gradient-to-br from-primary to-[hsl(217,95%,65%)] bg-clip-text text-transparent mb-1 md:mb-2">100%</div>
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