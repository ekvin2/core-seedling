import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import QuoteModal from "./QuoteModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

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
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-hero-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SC</span>
              </div>
              <span className="text-xl font-bold text-primary">SparkleClean</span>
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
              <button 
                onClick={() => handleNavigation('/gallery')}
                className="text-foreground hover:text-primary transition-colors"
              >
                Gallery
              </button>
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
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>(555) 123-4567</span>
              </div>
              <Button onClick={() => setIsQuoteModalOpen(true)}>
                Get Quote
              </Button>
              {user && isAdmin && (
                <Button variant="outline" onClick={() => navigate('/admin')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <nav className="flex flex-col space-y-4 pt-4">
                <button 
                  onClick={() => handleNavigation('/')}
                  className="text-left text-foreground hover:text-primary transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection("services")}
                  className="text-left text-foreground hover:text-primary transition-colors"
                >
                  Services
                </button>
                <button 
                  onClick={() => handleNavigation('/gallery')}
                  className="text-left text-foreground hover:text-primary transition-colors"
                >
                  Gallery
                </button>
                <button 
                  onClick={() => scrollToSection("reviews")}
                  className="text-left text-foreground hover:text-primary transition-colors"
                >
                  Reviews
                </button>
                <button 
                  onClick={() => handleNavigation('/contact')}
                  className="text-left text-foreground hover:text-primary transition-colors"
                >
                  Contact
                </button>
                <div className="flex items-center space-x-2 text-sm pt-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>(555) 123-4567</span>
                </div>
                <Button onClick={() => setIsQuoteModalOpen(true)} className="mt-2">
                  Get Quote
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
    </>
  );
};

export default Header;