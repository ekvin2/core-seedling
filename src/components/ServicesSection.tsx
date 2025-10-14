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

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
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
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 overflow-hidden"
            >
              <div className="aspect-[2/1] md:aspect-[4/3] overflow-hidden bg-muted">
                <img 
                  src={service.featured_image_url || service.service_image_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop'} 
                  alt={service.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardHeader className="text-center pb-1 md:pb-3 p-3 md:p-6">
                <CardTitle className="text-sm md:text-lg font-semibold leading-tight">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-3 md:p-6 pt-0">
                <Button 
                  onClick={() => navigate(`/service/${service.slug}`)}
                  variant="ghost"
                  className="w-full h-7 md:h-9 text-xs md:text-sm px-2 md:px-4"
                >
                  Learn More
                </Button>
              </CardContent>
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