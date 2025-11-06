import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LeadForm from "./LeadForm";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName?: string;
}

const QuoteModal = ({ isOpen, onClose, serviceName }: QuoteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Get Your Free Quote
            {serviceName && <span className="block text-primary text-lg">{serviceName}</span>}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 delay-100">
          <LeadForm onSuccess={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteModal;