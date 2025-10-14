import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateReviewSchema, injectStructuredData } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

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

  const handleGoogleReviewsClick = () => {
    window.open('https://business.google.com/your-business-profile', '_blank');
  };

  return (
    <section id="reviews" className="py-20 bg-subtle-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            {/* Google Reviews Badge */}
            <div className="flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-elegant">
              <div className="flex items-center space-x-1">
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
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Read authentic reviews from our satisfied customers who trust us with their homes and offices.
          </p>
        </div>

        {/* Clickable Review Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 cursor-pointer group"
          onClick={handleGoogleReviewsClick}
        >
          {reviews.map((review) => (
            <Card key={review.id} className="shadow-elegant hover:shadow-trust transition-all duration-300 group-hover:scale-[1.02] relative overflow-hidden">
              <CardContent className="p-6">
                {/* Header with Avatar and Rating */}
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {review.customer_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-base">{review.customer_name}</h4>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Review Text */}
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "{review.review_text}"
                </p>
                
                {/* Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No reviews yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;