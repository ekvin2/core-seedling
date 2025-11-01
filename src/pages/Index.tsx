import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WorksSection from "@/components/WorksSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";
import StickyCallButton from "@/components/StickyCallButton";
import { useSEO } from "@/hooks/useSEO";
import { generateLocalBusinessSchema } from "@/lib/seo";

const Index = () => {
  useSEO({
    title: "Easy House Wash NZ - Professional House Washing Services You Can Trust",
    description: "Professional house washing services including pressure washing, soft washing, and exterior surface cleaning. Expert care for your home's exterior. Get your free quote today!",
    canonical: window.location.origin,
    keywords: "house washing, pressure washing, soft washing, exterior cleaning, house exterior washing, professional washing services, exterior surface cleaning",
    schema: generateLocalBusinessSchema()
  });

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <WorksSection />
      <ReviewsSection />
      <Footer />
      <StickyCallButton />
    </main>
  );
};

export default Index;
