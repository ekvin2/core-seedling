import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "10 Essential Spring Cleaning Tips for a Fresh Home",
    excerpt: "Discover the most effective strategies to deep clean your home this spring season and maintain that fresh feeling all year long.",
    author: "Easy House Wash NZ Team",
    date: "March 15, 2024",
    readTime: "5 min read",
    category: "Cleaning Tips"
  },
  {
    title: "Eco-Friendly Cleaning Products: Better for You and the Planet",
    excerpt: "Learn about the benefits of using environmentally friendly cleaning products and how they can improve your home's air quality.",
    author: "Sarah Martinez",
    date: "March 8, 2024",
    readTime: "7 min read",
    category: "Green Living"
  },
  {
    title: "How Often Should You Deep Clean Different Areas of Your Home?",
    excerpt: "A comprehensive guide to creating the perfect cleaning schedule for every room in your house, from daily tasks to seasonal deep cleans.",
    author: "Mike Johnson",
    date: "February 28, 2024",
    readTime: "6 min read",
    category: "Home Maintenance"
  },
  {
    title: "The Ultimate Guide to Preparing Your Home for Professional Cleaning",
    excerpt: "Maximize the effectiveness of your professional cleaning service with these simple preparation tips and tricks.",
    author: "Easy House Wash NZ Team",
    date: "February 20, 2024",
    readTime: "4 min read",
    category: "Professional Tips"
  }
];

const BlogSection = () => {
  return (
    <section id="blog" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cleaning Tips & Insights
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest cleaning tips, home maintenance advice, 
            and industry insights from our professional team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-trust transition-all duration-300 group cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span className="bg-secondary px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Articles
          </Button>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-hero-gradient rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Stay Updated with Cleaning Tips</h3>
          <p className="mb-6 opacity-90">
            Subscribe to our newsletter for weekly cleaning tips, special offers, and home maintenance advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-foreground border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button variant="secondary" className="px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;