import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { generateFAQSchema, injectStructuredData } from "@/lib/seo";

interface ServiceFAQProps {
  serviceName: string;
}

const ServiceFAQ = ({ serviceName }: ServiceFAQProps) => {
  // Service-specific FAQs - would be customized per service type
  const faqs = [
    {
      question: `How long does a typical ${serviceName.toLowerCase()} take?`,
      answer: `The duration depends on the size of your space and specific requirements. Generally, our ${serviceName.toLowerCase()} takes 2-4 hours for an average home. We'll provide an accurate time estimate during your consultation based on your specific needs.`
    },
    {
      question: `What's included in your ${serviceName.toLowerCase()} service?`,
      answer: `Our comprehensive ${serviceName.toLowerCase()} includes all major cleaning tasks, eco-friendly products, professional equipment, and attention to detail in every room. We provide a detailed checklist so you know exactly what to expect from our service.`
    },
    {
      question: `Do I need to be home during the cleaning?`,
      answer: `No, you don't need to be present during the cleaning. Many of our clients provide access and go about their day. Our team is fully bonded and insured, and we'll securely lock up when we're finished. We can also work around your schedule if you prefer to be home.`
    },
    {
      question: `What cleaning products do you use?`,
      answer: `We use professional-grade, eco-friendly cleaning products that are safe for your family and pets. All our products are non-toxic and biodegradable. If you have specific product preferences or allergies, please let us know and we'll accommodate your needs.`
    },
    {
      question: `How much does this service cost?`,
      answer: `Pricing varies based on the size of your space, frequency of service, and specific requirements. We offer competitive rates and provide free, no-obligation quotes. Contact us today for a personalized estimate tailored to your needs.`
    },
    {
      question: `Are you licensed and insured?`,
      answer: `Yes, we are fully licensed, bonded, and insured for your peace of mind. Our team members undergo background checks and are trained in professional cleaning techniques. We maintain comprehensive liability insurance to protect both our team and your property.`
    },
    {
      question: `Can I customize the cleaning checklist?`,
      answer: `Absolutely! We understand every home is unique. We can customize our ${serviceName.toLowerCase()} checklist to focus on your priorities and specific needs. Just let us know your preferences when you book, and we'll tailor our service accordingly.`
    },
    {
      question: `What is your satisfaction guarantee?`,
      answer: `We stand behind our work with a 100% satisfaction guarantee. If you're not completely happy with any aspect of our ${serviceName.toLowerCase()}, contact us within 24 hours and we'll return to address any concerns at no additional charge.`
    }
  ];

  // Inject FAQ schema for SEO
  useEffect(() => {
    const cleanup = injectStructuredData(generateFAQSchema(faqs));
    return cleanup;
  }, [serviceName]);

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