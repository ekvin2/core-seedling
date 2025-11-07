import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import LeadForm from "./LeadForm";
import QuoteModal from "./QuoteModal";
import heroImage from "@/assets/pressure-washing-hero.png";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section id="home" className="min-h-[65vh] md:min-h-screen flex items-center bg-gradient-to-br from-[hsl(217,91%,35%)] via-[hsl(217,85%,40%)] to-[hsl(217,91%,45%)] pt-20 relative overflow-hidden py-8 md:py-12">
      {/* Background Image Overlay with Dark Gradient */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage}
          alt="Professional pressure washing service in New Zealand - worker cleaning house exterior with high-pressure equipment"
          className="w-full h-full object-cover opacity-20"
          width="1920"
          height="1080"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,25%)] via-[hsl(217,85%,35%)] to-[hsl(217,91%,30%)] opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(217,91%,20%)] to-transparent opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-4 py-8 md:py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-5 md:space-y-6 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight text-white">
                Professional 
                <span className="bg-gradient-to-r from-[hsl(200,100%,80%)] via-[hsl(210,100%,75%)] to-[hsl(200,100%,80%)] bg-clip-text text-transparent"> House Washing</span>
                <br />
                Services You Can Trust
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed mx-auto md:mx-0">
                Expert pressure washing, soft washing, and exterior surface cleaning. 
                Transform your home's exterior with our professional house washing services!
              </p>
            </div>
            
            {/* Mobile CTA Buttons */}
            {isMobile && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg"
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="min-h-[56px] text-lg font-semibold shadow-vibrant bg-hero-gradient-vibrant hover:shadow-glow transition-all duration-300"
                >
                  Get Free Quote
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  asChild
                  className="min-h-[56px] text-lg font-semibold bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
                >
                  <a href="tel:+64211234567">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* Right Content - Lead Form (Hidden on Mobile) */}
          {!isMobile && (
            <div className="relative">
              <div className="absolute inset-0 bg-hero-gradient opacity-10 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-background/95 backdrop-blur-sm rounded-2xl shadow-trust p-8 border border-border/20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Get Your Free Quote</h3>
                  <p className="text-muted-foreground">
                    Request a quote for pressure washing, soft washing, or exterior cleaning services
                  </p>
                </div>
                <LeadForm />
              </div>
            </div>
          )}
        </div>

      </div>
      
      {/* Mobile Quote Modal */}
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
    </section>
  );
};

export default HeroSection;