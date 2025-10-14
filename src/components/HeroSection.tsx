import { useState } from "react";
import { Button } from "@/components/ui/button";
import LeadForm from "./LeadForm";
import QuoteModal from "./QuoteModal";
import heroImage from "@/assets/hero-cleaning.jpg";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section id="home" className="min-h-[60vh] md:min-h-screen flex items-center bg-subtle-gradient pt-20 relative overflow-hidden py-6 md:py-12">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage}
          alt="Professional house cleaning service - sparkling clean home interior with modern furniture"
          className="w-full h-full object-cover opacity-10"
          width="1920"
          height="1080"
          loading="eager"
        />
        <div className="absolute inset-0 bg-hero-gradient/30"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-4 py-6 md:py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-4 md:space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl md:text-6xl font-bold leading-tight">
                Professional 
                <span className="text-primary"> House Cleaning</span>
                <br />
                Services You Can Trust
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-xl">
                Transform your home into a sparkling sanctuary with our reliable, 
                professional cleaning services. Book today and experience the difference!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 min-h-[44px]"
                onClick={() => setIsQuoteModalOpen(true)}
              >
                Get Free Quote
              </Button>
            </div>
          </div>

          {/* Right Content - Lead Form (Hidden on Mobile) */}
          {!isMobile && (
            <div className="relative">
              <div className="absolute inset-0 bg-hero-gradient opacity-10 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-background/95 backdrop-blur-sm rounded-2xl shadow-trust p-8 border border-border/20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Get Your Free Quote</h3>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24 hours
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