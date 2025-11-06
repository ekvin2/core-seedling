import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  slug: string;
}

const Footer = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [phoneNumber, setPhoneNumber] = useState("+64 21 123 4567");
  const [address, setAddress] = useState("Auckland Central\nAuckland, New Zealand");
  const [businessHours, setBusinessHours] = useState({
    monday: "7:00 AM - 7:00 PM",
    tuesday: "7:00 AM - 7:00 PM",
    wednesday: "7:00 AM - 7:00 PM",
    thursday: "7:00 AM - 7:00 PM",
    friday: "7:00 AM - 7:00 PM",
    saturday: "8:00 AM - 5:00 PM",
    sunday: "9:00 AM - 3:00 PM"
  });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch services
      const { data: servicesData } = await supabase
        .from('services')
        .select('id, title, slug')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (servicesData) {
        setServices(servicesData);
      }

      // Fetch business info
      const { data: businessData } = await supabase
        .from('business_info')
        .select('phone, address, business_hours')
        .single();
      
      if (businessData) {
        if (businessData.phone) {
          setPhoneNumber(businessData.phone);
        }
        if (businessData.address) {
          setAddress(businessData.address);
        }
        if (businessData.business_hours) {
          setBusinessHours(businessData.business_hours);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <footer id="contact" className="bg-gradient-to-br from-[hsl(217,91%,60%)] via-[hsl(217,85%,55%)] to-[hsl(217,91%,65%)] text-primary-foreground relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center shadow-glow">
                <span className="bg-gradient-to-br from-primary to-[hsl(217,95%,65%)] bg-clip-text text-transparent font-bold text-base md:text-lg">EHW</span>
              </div>
              <span className="text-xl md:text-2xl font-bold drop-shadow-sm">Easy House Wash NZ</span>
            </div>
            <p className="text-sm md:text-base opacity-90 leading-relaxed">
              Professional house washing and exterior cleaning services across New Zealand.
              We transform your property with reliable, eco-friendly pressure washing solutions.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="p-2 text-primary-foreground hover:bg-white/20 hover:shadow-glow transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-primary-foreground hover:bg-white/20 hover:shadow-glow transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-primary-foreground hover:bg-white/20 hover:shadow-glow transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 opacity-90">
              {services.map((service) => (
                <li key={service.id}>
                  <Link 
                    to={`/service/${service.slug}`} 
                    className="text-sm md:text-base hover:text-white transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 opacity-90">
              <li><Link to="/privacy-policy" className="text-sm md:text-base hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-sm md:text-base hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Get In Touch</h4>
            <div className="space-y-3 opacity-90">
              <div className="flex items-center space-x-3">
                <Phone className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-sm md:text-base">{phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-sm md:text-base">info@easyhousewash.nz</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 mt-1" />
                <span className="text-sm md:text-base whitespace-pre-line">{address}</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-3 h-3 md:w-4 md:h-4 mt-1" />
                <div className="text-sm md:text-base">
                  <div>Mon - Fri: {businessHours.monday}</div>
                  <div>Sat: {businessHours.saturday}</div>
                  <div>Sun: {businessHours.sunday}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm opacity-90">
              © {currentYear} Easy House Wash NZ. All rights reserved.
            </div>
            <div className="flex flex-col md:flex-row items-center md:space-x-6 text-sm opacity-90 space-y-2 md:space-y-0">
              <span>100% Satisfaction</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Eco-Friendly Products</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;