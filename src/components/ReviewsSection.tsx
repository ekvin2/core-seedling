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
      .limit(4);

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

  const handleWriteReview = () => {
    window.open('https://business.google.com/your-business-profile', '_blank');
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <p className="text-sm font-semibold tracking-wider uppercase mb-4 text-primary-foreground/80">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Trusted by Thousands, Loved by Many client's
            </h2>
            <p className="text-lg text-white/70 mb-12 max-w-xl">
              Read authentic reviews from our satisfied customers who trust us with their homes and offices. 
              We take pride in delivering exceptional cleaning services.
            </p>

            {/* Reviews Carousel */}
            {reviews.length > 0 ? (
              <Carousel className="w-full mb-8">
                <CarouselContent>
                  {reviews.map((review) => (
                    <CarouselItem key={review.id} className="md:basis-1/2">
                      <Card className="bg-gradient-to-br from-white to-primary/5 border-none shadow-elegant hover:shadow-2xl transition-all duration-300 h-full">
                        <CardContent className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                  {review.customer_name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-foreground">{review.customer_name}</h4>
                                <p className="text-sm text-primary">House Clean</p>
                              </div>
                            </div>
                            <svg className="w-10 h-10 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                            </svg>
                          </div>

                          {/* Review Text */}
                          <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                            {review.review_text}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center space-x-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center gap-2 mt-6">
                  <CarouselPrevious className="static translate-y-0 bg-white/10 border-white/20 text-white hover:bg-white/20" />
                  <CarouselNext className="static translate-y-0 bg-white/10 border-white/20 text-white hover:bg-white/20" />
                </div>
              </Carousel>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
                <p className="text-white/70">No reviews yet. Check back soon!</p>
              </div>
            )}

            {/* Write Review Button */}
            <Button 
              onClick={handleWriteReview}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 rounded-full group"
            >
              WRITE A REVIEW NOW
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Google Reviews Badge */}
            <div className="flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-elegant inline-flex mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="font-semibold text-gray-700">Google Reviews</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm font-semibold ml-1">4.9</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:block">
            <img 
              src={testimonialsImage} 
              alt="Happy Easy House Wash NZ cleaner" 
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;