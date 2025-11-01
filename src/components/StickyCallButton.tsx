import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const StickyCallButton = () => {
  return (
    <a
      href="tel:+64211234567"
      className="fixed bottom-6 right-6 z-50 md:hidden"
      aria-label="Call Easy House Wash NZ now"
    >
      <Button
        size="lg"
        className="h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 animate-pulse hover:animate-none"
      >
        <Phone className="w-7 h-7" />
      </Button>
    </a>
  );
};

export default StickyCallButton;
