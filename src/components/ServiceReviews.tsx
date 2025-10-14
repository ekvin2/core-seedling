import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateReviewSchema, injectStructuredData } from "@/lib/seo";

interface ServiceReviewsProps {
  serviceName: string;
}

const ServiceReviews = ({ serviceName }: ServiceReviewsProps) => {
  // Service-specific reviews - would be filtered by service type in real implementation
  const serviceReviews = [
    {
      name: "Jennifer Martinez",
      location: "Oak Park",
      rating: 5,
      review: `The ${serviceName.toLowerCase()} was absolutely phenomenal! The team was thorough, professional, and left my home sparkling clean. Every detail was taken care of and they exceeded my expectations completely.`,
      date: "1 week ago",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      initials: "JM",
      verified: true
    },
    {
      name: "Robert Kim",
      location: "Downtown",
      rating: 5,
      review: `Outstanding ${serviceName.toLowerCase()}! The difference was immediately noticeable. Professional team, eco-friendly products, and exceptional attention to detail. Highly recommend their services!`,
      date: "2 weeks ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      initials: "RK",
      verified: true
    },
    {
      name: "Lisa Chen",
      location: "Westside",
      rating: 5,
      review: `Perfect ${serviceName.toLowerCase()} service! They transformed my space and the results lasted for weeks. Great value for money and the team was incredibly reliable and trustworthy.`,
      date: "3 weeks ago",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      initials: "LC",
      verified: true
    }
  ];

  // Inject review schema for SEO
  useEffect(() => {
    const cleanup = injectStructuredData(generateReviewSchema(serviceReviews));
    return cleanup;
  }, [serviceName]);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Customers Say About Our {serviceName}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Read authentic reviews from customers who have experienced our {serviceName.toLowerCase()} service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceReviews.map((review, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-trust transition-all duration-300">
              <CardContent className="p-6">
                {/* Header with Avatar and Rating */}
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {review.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-base flex items-center">
                          {review.name}
                          {review.verified && (
                            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Verified
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">{review.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Review Text */}
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "{review.review}"
                </p>
                
                {/* Date */}
                <div className="text-sm text-muted-foreground">
                  {review.date}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Reviews CTA */}
        <div className="text-center mt-12">
          <div className="bg-subtle-gradient rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2">Read More Reviews</h3>
            <p className="text-muted-foreground mb-4">
              See what other customers say about our cleaning services on Google Business Profile.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="font-semibold ml-1">4.9/5</span>
              </div>
              <span className="text-muted-foreground">127+ Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceReviews;