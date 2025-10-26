import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";

const PrivacyPolicy = () => {
  useSEO({
    title: "Privacy Policy | Easy House Wash NZ - House Washing Services",
    description: "Read Easy House Wash NZ's privacy policy to understand how we collect, use, and protect your personal information.",
    canonical: `${window.location.origin}/privacy-policy`,
  });

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <article className="container mx-auto px-4 py-32 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last Updated: January 2025</p>
        </header>

        <section className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Easy House Wash NZ collects personal information that you provide to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Request a quote for our cleaning services</li>
              <li>Book a cleaning appointment</li>
              <li>Contact us through our website or phone</li>
              <li>Subscribe to our newsletter or marketing communications</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The information we collect may include: name, email address, phone number, 
              home address, and details about your cleaning requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide and improve our cleaning services</li>
              <li>Communicate with you about appointments and services</li>
              <li>Send you quotes and service confirmations</li>
              <li>Process payments and maintain records</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and customer experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. 
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Service providers who assist in our operations (payment processors, scheduling systems)</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your personal information 
              from unauthorized access, alteration, disclosure, or destruction. However, no 
              internet transmission is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website uses cookies to enhance your browsing experience. Cookies are small 
              text files stored on your device. You can control cookie settings through your 
              browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are not directed to children under 18. We do not knowingly collect 
              personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any 
              significant changes by posting the new policy on this page and updating the 
              "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this privacy policy or how we handle your personal 
              information, please contact us:
            </p>
            <div className="mt-4 space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> info@easyhousewash.nz</p>
              <p><strong>Phone:</strong> +64 21 123 4567</p>
              <p><strong>Address:</strong> 123 Clean Street, Your City, ST 12345</p>
            </div>
          </section>
        </section>
      </article>

      <Footer />
    </main>
  );
};

export default PrivacyPolicy;
