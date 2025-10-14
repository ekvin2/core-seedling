import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WorksSection from "@/components/WorksSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { generateLocalBusinessSchema } from "@/lib/seo";

const Index = () => {
  useSEO({
    title: "SparkleClean - Professional House Cleaning Services | Licensed & Insured",
    description: "Professional house cleaning services you can trust. Licensed, insured, and eco-friendly. Get your free quote today for regular cleaning, deep cleaning, and more!",
    canonical: window.location.origin,
    keywords: "house cleaning, professional cleaning services, eco-friendly cleaning, home cleaning, deep cleaning, licensed cleaning service",
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
    </main>
  );
};

export default Index;
