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
    <section id="reviews" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real feedback from our valued customers who have experienced our services firsthand
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.length > 0 ? reviews.map((review) => (
            <Card key={review.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Rating Stars */}
                <div className="flex items-center justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < review.rating ? 'fill-emerald-500 text-emerald-500' : 'fill-gray-200 text-gray-200'}`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-center mb-6 font-normal leading-relaxed">
                  "{review.review_text}"
                </p>

                {/* Customer Name */}
                <p className="text-center font-semibold text-gray-900">
                  {review.customer_name}
                </p>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No reviews yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

