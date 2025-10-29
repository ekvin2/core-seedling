import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface ServiceGalleryProps {
  serviceName: string;
  serviceId: string;
}

interface PortfolioImage {
  id: string;
  image_url: string;
  title: string;
  description?: string;
  service_id: string;
  is_active: boolean;
  created_at: string;
}

const ServiceGallery = ({ serviceName, serviceId }: ServiceGalleryProps) => {
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioImages = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .eq('service_id', serviceId)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching portfolio images:', error);
          return;
        }

        setPortfolioImages(data || []);
      } catch (err) {
        console.error('Unexpected error fetching portfolio images:', err);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchPortfolioImages();
    }
  }, [serviceId]);

  return (
    <section className="py-16 bg-subtle-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {serviceName} Photo Gallery
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See the incredible results we achieve with our {serviceName.toLowerCase()} service.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : portfolioImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioImages.map((image) => (
              <Card key={image.id} className="overflow-hidden group hover:shadow-trust transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={image.image_url}
                      alt={`${serviceName} - ${image.title}${image.description ? ` - ${image.description}` : ''}`}
                      className="w-full h-64 object-cover"
                      loading="lazy"
                      width="600"
                      height="400"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                        {image.description && (
                          <p className="text-sm opacity-90">{image.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No portfolio images available for this service yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceGallery;