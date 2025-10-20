import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";


const WorksSection = () => {
  // Unified image shape used by the UI — keeps `url` field consistent
  type UIImage = {
    id: string | number;
    url: string;
    title?: string | null;
    description?: string | null;
  };

  const [images, setImages] = useState<UIImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch images from Supabase `portfolio` table
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data, error } = await supabase
          .from("portfolio")
          .select("id, image_url, title, is_active, taken_at")
          .eq("is_active", true)
          .order("taken_at", { ascending: false });

        if (error) {
          console.error("Error fetching portfolio:", error);
          // keep sample images as fallback
        } else if (data && data.length > 0) {
          // Normalize DB rows (which use `image_url`) into our UI shape (`url`)
          const mapped = data.map((d: any) => ({
            id: d.id,
            url: d.image_url,
            title: d.title ?? undefined,
            description: undefined,
          }));

          setImages(mapped as UIImage[]);
        } else {
          // no data, set empty images array
          setImages([]);
        }
        } catch (err) {
        console.error("Unexpected error fetching portfolio:", err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <section className="py-8 md:py-20 bg-subtle-gradient">
      <div className="container mx-auto px-3 md:px-4">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
            Our Work Portfolio
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
            See the amazing transformations we've achieved for our satisfied customers. 
            Every project showcases our commitment to excellence and attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
          {images.map((image) => (
            <Card key={image.id} className="group overflow-hidden hover:shadow-trust transition-all duration-300 hover:scale-[1.02]">
              <div className="relative overflow-hidden aspect-square md:aspect-[4/3]">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-background rounded-xl md:rounded-2xl p-4 md:p-8 max-w-2xl mx-auto shadow-elegant">
            <ImageIcon className="w-8 md:w-12 h-8 md:h-12 text-primary mx-auto mb-2 md:mb-4" />
            <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">Ready to Transform Your Space?</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
              Join hundreds of satisfied customers who have experienced our exceptional cleaning services.
            </p>
            <Button size="lg" className="px-6 md:px-8 h-10 md:h-11 text-sm md:text-base">
              View Full Portfolio
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorksSection;