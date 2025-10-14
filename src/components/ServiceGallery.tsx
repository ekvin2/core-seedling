import { Card, CardContent } from "@/components/ui/card";

interface ServiceGalleryProps {
  serviceName: string;
}

const ServiceGallery = ({ serviceName }: ServiceGalleryProps) => {
  // Sample gallery images - 6 individual transformation photos
  const galleryImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
      title: "Sparkling Kitchen",
      description: "Professional kitchen deep clean with attention to every detail"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      title: "Pristine Living Space",
      description: "Living room cleaning with furniture care and floor polishing"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
      title: "Immaculate Bathroom",
      description: "Bathroom sanitization and deep cleaning service"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&h=400&fit=crop",
      title: "Fresh Bedroom",
      description: "Bedroom cleaning with linen change and dusting"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=400&fit=crop",
      title: "Organized Dining Area",
      description: "Dining room cleaning and organization"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
      title: "Spotless Entryway",
      description: "Entryway and hallway professional cleaning"
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <Card key={image.id} className="overflow-hidden group hover:shadow-trust transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={image.url}
                    alt={`${serviceName} - ${image.title} - ${image.description}`}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                      <p className="text-sm opacity-90">{image.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGallery;