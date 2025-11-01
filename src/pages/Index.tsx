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
    title: "Easy house wash NZ - Professional House Cleaning Services You Can Trust",
    description: "Professional house cleaning services you can trust. Eco-friendly products and expert care. Get your free quote today for regular cleaning, deep cleaning, and more!",
    canonical: window.location.origin,
    keywords: "house cleaning, professional cleaning services, eco-friendly cleaning, home cleaning, deep cleaning, trusted cleaning service",
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
