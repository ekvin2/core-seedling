import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { generateReviewSchema, injectStructuredData } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import testimonialsImage from "@/assets/testimonials-person.png";

interface Review {
  id: string;
  customer_name: string;
  review_text: string;
  rating: number;
  service_id?: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (data && !error) {
      setReviews(data);
    }
  };

  // Inject review schema for SEO
  useEffect(() => {
    if (reviews.length > 0) {
      const reviewsForSchema = reviews.map(r => ({
        name: r.customer_name,
        rating: r.rating,
        review: r.review_text,
        date: new Date(r.created_at).toLocaleDateString()
      }));
      const cleanup = injectStructuredData(generateReviewSchema(reviewsForSchema));
      return cleanup;
    }
  }, [reviews]);

  return (
    <section id="reviews" className="relative py-20 overflow-hidden bg-gradient-to-br from-[#1a3a3a] via-[#0d2626] to-[#1a3a3a]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
        }} />
      </div>
      
      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-accent/10 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-wider uppercase mb-4 text-primary-foreground/80">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
            Trusted by Thousands, Loved by Many client's
          </h2>
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            Read authentic reviews from our satisfied customers who trust us with their homes and offices. 
            We take pride in delivering exceptional cleaning services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.length > 0 ? reviews.map((review) => (
            <Card key={review.id} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-elegant hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                {/* Rating Stars */}
                <div className="flex items-center justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-center mb-8 font-normal leading-relaxed text-lg">
                  "{review.review_text}"
                </p>

                {/* Customer Name */}
                <p className="text-center font-semibold text-gray-900 text-lg">
                  {review.customer_name}
                </p>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-white/70">No reviews yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

