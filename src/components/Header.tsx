import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import QuoteModal from "./QuoteModal";
import logo from "@/assets/logo.jpeg";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+64 21 123 4567");
  const [showStickyQuote, setShowStickyQuote] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      const { data } = await supabase
        .from('business_info')
        .select('phone')
        .single();

      if (data?.phone) {
        setPhoneNumber(data.phone);
      }
    };

    fetchBusinessInfo();
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowStickyQuote(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-elegant">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Optimized for mobile */}
            <div 
              className="flex items-center space-x-2 md:space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
              aria-label="Easy House Wash NZ Home"
            >
              <img 
                src={logo} 
                alt="Easy House Wash NZ - Professional House Cleaning Services Logo" 
                className="h-10 md:h-12 w-auto object-contain" 
                width="48"
                height="48"
              />
              <span className="text-base md:text-xl font-bold text-primary">Easy House Wash NZ</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleNavigation('/')}
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("services")}
                className="text-foreground hover:text-primary transition-colors"
              >
                Services
              </button>
              {/* Gallery removed */}
              <button 
                onClick={() => scrollToSection("reviews")}
                className="text-foreground hover:text-primary transition-colors"
              >
                Reviews
              </button>
              <button 
                onClick={() => handleNavigation('/contact')}
                className="text-foreground hover:text-primary transition-colors"
              >
                Contact
              </button>
            </nav>

            {/* Contact Info & CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <a 
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
                aria-label={`Call us at ${phoneNumber}`}
              >
                <Phone className="w-4 h-4 text-primary" />
                <span>{phoneNumber}</span>
              </a>
              <Button 
                onClick={() => setIsQuoteModalOpen(true)}
                size="lg"
                className="min-h-[48px]"
              >
                Get Free Quote
              </Button>
              {user && isAdmin && (
                <Button variant="outline" onClick={() => navigate('/admin')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
            </div>

            {/* Mobile Menu Button - Touch optimized */}
            <button
              className="md:hidden p-3 min-w-[48px] min-h-[48px] flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu - Touch optimized */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <nav className="flex flex-col space-y-2 pt-4">
                <button 
                  onClick={() => handleNavigation('/')}
                  className="text-left text-foreground hover:text-primary transition-colors py-3 px-2 text-lg min-h-[48px]"
                  aria-label="Navigate to home"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection("services")}
                  className="text-left text-foreground hover:text-primary transition-colors py-3 px-2 text-lg min-h-[48px]"
                  aria-label="View our services"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection("reviews")}
                  className="text-left text-foreground hover:text-primary transition-colors py-3 px-2 text-lg min-h-[48px]"
                  aria-label="Read customer reviews"
                >
                  Reviews
                </button>
                <button 
                  onClick={() => handleNavigation('/contact')}
                  className="text-left text-foreground hover:text-primary transition-colors py-3 px-2 text-lg min-h-[48px]"
                  aria-label="Contact us"
                >
                  Contact
                </button>
                <a 
                  href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                  className="flex items-center space-x-2 text-base pt-3 px-2 min-h-[48px] hover:text-primary transition-colors"
                  aria-label={`Call us at ${phoneNumber}`}
                >
                  <Phone className="w-5 h-5 text-primary" />
                  <span>{phoneNumber}</span>
                </a>
                <Button 
                  onClick={() => setIsQuoteModalOpen(true)} 
                  size="lg"
                  className="mt-4 min-h-[52px] text-lg"
                >
                  Get Free Quote
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>
      
      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />

      {/* Sticky Quote Button for Mobile - Appears on scroll */}
      {isMobile && showStickyQuote && (
        <div className="fixed bottom-6 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <Button
            onClick={() => setIsQuoteModalOpen(true)}
            size="lg"
            className="w-full min-h-[56px] text-lg font-semibold shadow-vibrant bg-hero-gradient-vibrant hover:shadow-glow"
          >
            Get Free Quote
          </Button>
        </div>
      )}
    </>
  );
};

export default Header;