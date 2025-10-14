import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";

const TermsOfService = () => {
  useSEO({
    title: "Terms of Service | SparkleClean House Cleaning Services",
    description: "Read SparkleClean's terms of service to understand the terms and conditions of using our professional cleaning services.",
    canonical: `${window.location.origin}/terms-of-service`,
  });

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <article className="container mx-auto px-4 py-32 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last Updated: January 2025</p>
        </header>

        <section className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using SparkleClean's services, you agree to be bound by these 
              Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Services Description</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              SparkleClean provides professional house cleaning services including, but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Regular house cleaning</li>
              <li>Deep cleaning services</li>
              <li>Move-in/move-out cleaning</li>
              <li>Post-construction cleaning</li>
              <li>Office cleaning</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Booking and Payment</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Booking:</strong> All bookings are subject to availability. We will confirm 
              your appointment via email or phone.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Payment:</strong> Payment is due upon completion of services unless other 
              arrangements have been made. We accept various payment methods including cash, 
              credit cards, and online payments.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Pricing:</strong> Prices are estimates based on the information you provide. 
              Final pricing may vary depending on the actual condition and size of the space.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Cancellation Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>By Client:</strong> Cancellations must be made at least 24 hours before the 
              scheduled service time. Cancellations made less than 24 hours in advance may be 
              subject to a cancellation fee.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>By SparkleClean:</strong> We reserve the right to cancel or reschedule 
              services due to unforeseen circumstances. We will notify you as soon as possible 
              and work to reschedule at your convenience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Client Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a client, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide a safe working environment for our cleaning team</li>
              <li>Secure or remove valuables and fragile items before our arrival</li>
              <li>Ensure access to the property at the scheduled time</li>
              <li>Provide accurate information about the space to be cleaned</li>
              <li>Notify us of any pets or special considerations</li>
              <li>Inform us of any hazardous materials or biohazards present</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Satisfaction Guarantee</h2>
            <p className="text-muted-foreground leading-relaxed">
              We stand behind our work with a 100% satisfaction guarantee. If you are not 
              satisfied with our service, please contact us within 24 hours of service completion, 
              and we will return to address your concerns at no additional charge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              SparkleClean is fully insured and bonded. However, we are not liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Pre-existing damage not reported before service</li>
              <li>Damage to items that require special care not disclosed</li>
              <li>Loss or damage to unsecured valuables</li>
              <li>Damage resulting from client's failure to provide safe working conditions</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Our liability is limited to the cost of the specific service provided.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Insurance and Bonding</h2>
            <p className="text-muted-foreground leading-relaxed">
              SparkleClean is fully licensed, bonded, and insured. All team members undergo 
              background checks and professional training.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy for information 
              on how we collect, use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will 
              be effective immediately upon posting to our website. Your continued use of our 
              services constitutes acceptance of any modifications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service are governed by the laws of the state in which SparkleClean 
              operates. Any disputes shall be resolved in the appropriate courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> info@sparkleclean.com</p>
              <p><strong>Phone:</strong> (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Clean Street, Your City, ST 12345</p>
            </div>
          </section>
        </section>
      </article>

      <Footer />
    </main>
  );
};

export default TermsOfService;
