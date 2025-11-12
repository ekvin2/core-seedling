import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CityAutocomplete } from "@/components/CityAutocomplete";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface LeadFormProps {
  onSuccess?: () => void;
}

const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters").optional().or(z.literal('')),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20, "Phone number must be less than 20 digits"),
  city: z.string().max(100).optional().or(z.literal('')),
  service: z.string().min(1, "Please select a service"),
  message: z.string().trim().max(1000, "Message must be less than 1000 characters").optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

const LeadForm = ({ onSuccess }: LeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [servicesList, setServicesList] = useState<Array<{ id: string; title: string }>>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    
    try {
      // Insert into quotes table
      const serviceId = data.service;
      // prevent submitting sentinel values
      if (serviceId === '__loading' || serviceId === '__none' || !serviceId) {
        toast({ title: 'Error', description: 'Please select a valid service', variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }

      const { data: inserted, error } = await supabase.from('quotes').insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          service_id: serviceId,
          note: data.message || null,
          is_active: true
        }
      ]).select();

      console.log('quotes.insert result', { inserted, error });

      if (error) {
        throw error;
      }

      // Send notification email to admin
      try {
        await supabase.functions.invoke('send-lead-notification', {
          body: {
            lead: {
              name: data.name,
              email: data.email,
              phone: data.phone,
              city: data.city,
              service: servicesList.find(s => s.id === data.service)?.title || 'General Inquiry',
              message: data.message,
            },
          },
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }

    

      toast({
        title: "Quote Request Submitted!",
        description: "We'll get back to you within 24 hours with your free quote.",
      });

      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an issue submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, title, is_active')
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching services for LeadForm', error);
          toast({ title: 'Error', description: 'Unable to load services', variant: 'destructive' });
          setServicesList([]);
        } else {
          const list = (data as any[] || [])
            .filter(s => s.is_active !== false)
            .map(s => ({ id: s.id, title: s.title }));
          setServicesList(list);
        }
      } catch (err) {
        console.error('Unexpected error fetching services', err);
        toast({ title: 'Error', description: 'Unable to load services', variant: 'destructive' });
        setServicesList([]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="John Doe"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address (Optional)</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john@example.com"
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="+64123456789"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City (Optional)</Label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <CityAutocomplete
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.city?.message}
                required={false}
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service Needed *</Label>
        <Select onValueChange={(value) => setValue("service", value)}>
          <SelectTrigger className={errors.service ? "border-destructive" : ""}>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {servicesLoading ? (
              <SelectItem value="__loading" disabled>Loading...</SelectItem>
            ) : servicesList.length > 0 ? (
              servicesList.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
              ))
            ) : (
              <SelectItem value="__none" disabled>No services available</SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.service && (
          <p className="text-sm text-destructive">{errors.service.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Additional Details (Optional)</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Tell us about your specific cleaning needs, home size, frequency preferences, etc."
          className={errors.message ? "border-destructive" : ""}
          rows={4}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full min-h-[52px] text-base md:text-lg font-semibold"
        disabled={isSubmitting}
        aria-label="Submit quote request form"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Get Free Quote"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting this form, you agree to be contacted by our team regarding your cleaning service inquiry.
      </p>
    </form>
  );
};

export default LeadForm;