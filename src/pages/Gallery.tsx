import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteModal from "@/components/QuoteModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Camera, Star } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const Gallery = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useSEO({
    title: "Gallery - SparkleClean Before & After Cleaning Photos",
    description: "View our amazing before and after cleaning photos. See the incredible transformations SparkleClean achieves with professional house cleaning services.",
    canonical: `${window.location.origin}/gallery`,
    keywords: "cleaning before after photos, house cleaning gallery, cleaning transformation photos, professional cleaning results"
  });

  // Sample gallery data - would be replaced with actual images from database/CMS
  const galleryImages = [
    {
      id: 1,
      title: "Kitchen Deep Clean Transformation",
      category: "kitchen",
      before: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      after: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
      description: "Complete kitchen deep cleaning including appliances, countertops, and cabinets",
      service: "Deep Cleaning",
      rating: 5
    },
    {
      id: 2,
      title: "Living Room Revival",
      category: "living-room",
      before: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
      after: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      description: "Comprehensive living room cleaning with furniture dusting and floor care",
      service: "Regular Cleaning",
      rating: 5
    },
    {
      id: 3,
      title: "Bathroom Restoration",
      category: "bathroom",
      before: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop",
      after: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
      description: "Professional bathroom cleaning and sanitization",
      service: "Deep Cleaning",
      rating: 5
    },
    {
      id: 4,
      title: "Office Space Cleaning",
      category: "office",
      before: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
      after: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop",
      description: "Corporate office deep cleaning and organization",
      service: "Office Cleaning",
      rating: 5
    },
    {
      id: 5,
      title: "Bedroom Makeover",
      category: "bedroom",
      before: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop",
      after: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      description: "Complete bedroom cleaning and fresh linens",
      service: "Regular Cleaning",
      rating: 5
    },
    {
      id: 6,
      title: "Post-Construction Cleanup",
      category: "construction",
      before: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      after: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
      description: "Professional post-construction cleaning and debris removal",
      service: "Post-Construction",
      rating: 5
    }
  ];

  const categories = [
    { id: "all", name: "All Projects", count: galleryImages.length },
    { id: "kitchen", name: "Kitchen", count: galleryImages.filter(img => img.category === "kitchen").length },
    { id: "bathroom", name: "Bathroom", count: galleryImages.filter(img => img.category === "bathroom").length },
    { id: "living-room", name: "Living Room", count: galleryImages.filter(img => img.category === "living-room").length },
    { id: "bedroom", name: "Bedroom", count: galleryImages.filter(img => img.category === "bedroom").length },
    { id: "office", name: "Office", count: galleryImages.filter(img => img.category === "office").length },
    { id: "construction", name: "Construction", count: galleryImages.filter(img => img.category === "construction").length }
  ];

  const filteredImages = selectedCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-hero-gradient text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Our Work Gallery
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
                See the incredible transformations we achieve with every cleaning project. Before and after photos that speak for themselves.
              </p>
              
              <div className="flex items-center justify-center space-x-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm opacity-90">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm opacity-90">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">5★</div>
                  <div className="text-sm opacity-90">Average Rating</div>
                </div>
              </div>
              
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8"
                onClick={() => setIsQuoteModalOpen(true)}
              >
                <Camera className="w-4 h-4 mr-2" />
                Get Your Free Quote
              </Button>
            </div>
          </div>
        </section>

        {/* Filter Categories */}
        <section className="py-8 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="rounded-full"
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 bg-subtle-gradient">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredImages.map((image) => (
                <Card key={image.id} className="group overflow-hidden hover:shadow-trust transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      {/* Before Image */}
                      <div className="relative">
                        <img
                          src={image.before}
                          alt={`Before professional cleaning - ${image.title} - ${image.description}`}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                          width="600"
                          height="400"
                        />
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Before
                        </div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <ExternalLink className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      {/* After Image */}
                      <div className="relative">
                        <img
                          src={image.after}
                          alt={`After professional cleaning - ${image.title} - spotless ${image.category} cleaning results`}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                          width="600"
                          height="400"
                        />
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          After
                        </div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <ExternalLink className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      {/* Project Details */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg leading-tight">{image.title}</h3>
                          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                            {[...Array(image.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                          {image.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {image.service}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setIsQuoteModalOpen(true)}
                          >
                            Get Quote
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to See Your Own Transformation?
              </h2>
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                Join hundreds of satisfied customers who have experienced the SparkleClean difference. 
                Let us transform your space into something spectacular.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Get Free Quote
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Call (555) 123-4567
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold mb-2">Free Estimates</div>
                  <div className="opacity-90 text-sm">No hidden fees or surprises</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2">Licensed & Insured</div>
                  <div className="opacity-90 text-sm">Your peace of mind guaranteed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-2">100% Satisfaction</div>
                  <div className="opacity-90 text-sm">We'll make it right</div>
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
      />
    </div>
  );
};

export default Gallery;