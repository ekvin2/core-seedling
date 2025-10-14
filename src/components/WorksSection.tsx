import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, ExternalLink } from "lucide-react";

// Sample gallery images - replace with actual gallery integration
const sampleImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    title: "Living Room Deep Clean",
    description: "Complete transformation of family living space"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    title: "Kitchen Restoration",
    description: "Professional kitchen cleaning and sanitization"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    title: "Bathroom Renovation Clean",
    description: "Post-construction cleaning perfection"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop",
    title: "Office Space Cleaning",
    description: "Corporate office deep cleaning service"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop",
    title: "Bedroom Makeover",
    description: "Complete bedroom cleaning and organization"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
    title: "Move-Out Cleaning",
    description: "Professional move-out cleaning service"
  }
];

const WorksSection = () => {
  const [images, setImages] = useState(sampleImages);
  const [loading, setLoading] = useState(false);

  // Future: Replace with actual gallery API integration
  useEffect(() => {
    // This would fetch from your gallery/portfolio API
    // For now, using sample images
    setImages(sampleImages.slice(0, 6));
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