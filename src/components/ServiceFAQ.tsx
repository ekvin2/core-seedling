import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { generateFAQSchema, injectStructuredData } from "@/lib/seo";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

interface ServiceFAQProps {
  serviceName: string;
  // Optional service id to fetch service-specific faqs. If omitted, no FAQs will be fetched.
  serviceId?: string | null;
}


const ServiceFAQ = ({ serviceName, serviceId }: ServiceFAQProps) => {
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Fetch FAQs from Supabase for the given serviceId (only service-specific FAQs)
  useEffect(() => {
    let mounted = true;

    const fetchFaqs = async () => {
      // If no serviceId provided, don't fetch any FAQs.
      if (!serviceId) {
        setFaqs([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("faqs")
          .select("*")
          .eq("is_active", true)
          .eq("service_id", serviceId)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (fetchError) throw fetchError;

        if (mounted && data) {
          setFaqs(
            data
              .filter((row) => row.is_active)
              .map((row) => ({ question: row.question, answer: row.answer }))
          );
        }
      } catch (err: any) {
        // Drop to empty list on error and surface a message for diagnostics
        setError(err?.message || "Failed to load FAQs");
        setFaqs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFaqs();

    return () => {
      mounted = false;
    };
  }, [serviceId]);

  // Inject FAQ schema for SEO (update when faqs change)
  useEffect(() => {
    if (!faqs || faqs.length === 0) return;

    const cleanup = injectStructuredData(generateFAQSchema(faqs));
    return cleanup;
  }, [faqs]);

  return (
    <section className="py-16 bg-subtle-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get answers to common questions about our {serviceName.toLowerCase()} service.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background rounded-lg border border-border/50 px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Additional Help CTA */}
        <div className="text-center mt-12">
          <div className="bg-background rounded-xl p-8 max-w-2xl mx-auto shadow-elegant">
            <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our friendly team is here to help! Contact us for personalized answers about our {serviceName.toLowerCase()} service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">Call Us</div>
                <div className="text-muted-foreground">+64 21 123 4567</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">Email Us</div>
                <div className="text-muted-foreground">info@easyhousewash.nz</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceFAQ;