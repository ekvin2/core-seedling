import { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";
import QuoteModal from "@/components/QuoteModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const Contact = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [businessPhone, setBusinessPhone] = useState('(555) 123-4567');
  const [businessAddress, setBusinessAddress] = useState('123 Clean Street\nYour City, ST 12345');
  const [businessHours, setBusinessHours] = useState<Record<string, { open?: string; close?: string; closed?: boolean }> | null>(null);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      const { data } = await supabase
        .from('business_info')
        .select('phone, address, business_hours')
        .single();
      
      if (data?.phone) {
        setBusinessPhone(data.phone);
      }
      if (data?.address) {
        setBusinessAddress(data.address);
      }
      if (data?.business_hours) {
        setBusinessHours(data.business_hours as Record<string, { open?: string; close?: string; closed?: boolean }>);
      }
    };

    fetchBusinessInfo();
  }, []);

  useSEO({
    title: "Contact Easy House Wash NZ - Get Your Free Washing Quote Today",
    description: "Contact Easy House Wash NZ for professional house washing and exterior cleaning services across New Zealand. Get your free quote, schedule a consultation, or ask questions today!",
    canonical: `${window.location.origin}/contact`,
    keywords: "contact house washing nz, exterior cleaning quote, pressure washing auckland, roof washing wellington, house wash christchurch, free quote"
  });

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
                Get In Touch With Easy House Wash NZ
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
                Ready to transform your space? Contact us today for a free quote and experience the difference professional cleaning makes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  Get Free Quote
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call {businessPhone}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Multiple Ways to Reach Us
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the method that works best for you. We're here to help and respond quickly to all inquiries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {/* Phone */}
              <Card className="text-center shadow-elegant hover:shadow-trust transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                  <p className="text-muted-foreground mb-4">Speak directly with our team</p>
                  <p className="text-lg font-semibold text-primary">{businessPhone}</p>
                  <p className="text-sm text-muted-foreground mt-2">Mon-Fri: 8AM-6PM<br />Sat: 9AM-4PM</p>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="text-center shadow-elegant hover:shadow-trust transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                  <p className="text-muted-foreground mb-4">Send us a detailed message</p>
                  <p className="text-lg font-semibold text-primary">info@easyhousewash.nz</p>
                  <p className="text-sm text-muted-foreground mt-2">Response within 24 hours</p>
                </CardContent>
              </Card>

              {/* Text Message */}
              <Card className="text-center shadow-elegant hover:shadow-trust transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Text Us</h3>
                  <p className="text-muted-foreground mb-4">Quick questions and scheduling</p>
                  <p className="text-lg font-semibold text-primary">{businessPhone}</p>
                  <p className="text-sm text-muted-foreground mt-2">Fast response during business hours</p>
                </CardContent>
              </Card>

              {/* Visit Us */}
              <Card className="text-center shadow-elegant hover:shadow-trust transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground mb-4">Stop by our office</p>
                  <p className="text-sm font-medium whitespace-pre-line">{businessAddress}</p>
                  <p className="text-sm text-muted-foreground mt-2">By appointment only</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 bg-subtle-gradient">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <div>
                <Card className="shadow-elegant">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-4">Get Your Free Quote</h3>
                      <p className="text-muted-foreground">
                        Fill out the form below and we'll get back to you within 24 hours with a personalized quote.
                      </p>
                    </div>
                    <LeadForm />
                  </CardContent>
                </Card>
              </div>

              {/* Business Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Why Choose Easy House Wash NZ?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Professional Service</h4>
                        <p className="text-muted-foreground text-sm">Expert team trained in professional cleaning techniques</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">100% Satisfaction Guarantee</h4>
                        <p className="text-muted-foreground text-sm">Not happy? We'll return to make it right at no charge</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Eco-Friendly Products</h4>
                        <p className="text-muted-foreground text-sm">Safe for your family, pets, and the environment</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">2+ Years Experience</h4>
                        <p className="text-muted-foreground text-sm">Trusted by 500+ satisfied customers</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="shadow-elegant">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold mb-4 flex items-center">
                      <Clock className="w-5 h-5 text-primary mr-2" />
                      Business Hours
                    </h4>
                    <div className="space-y-2 text-sm">
                      {businessHours ? (
                        Object.entries(businessHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="capitalize">{day}</span>
                            <span className="font-medium">
                              {hours.closed ? (
                                'Closed'
                              ) : (
                                `${hours.open || 'N/A'} - ${hours.close || 'N/A'}`
                              )}
                            </span>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span>Monday - Friday</span>
                            <span className="font-medium">8:00 AM - 6:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saturday</span>
                            <span className="font-medium">9:00 AM - 4:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sunday</span>
                            <span className="font-medium">Closed</span>
                          </div>
                        </>
                      )}
                    </div>
                   
                  </CardContent>
                </Card>

                
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

export default Contact;