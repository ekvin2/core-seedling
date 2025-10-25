import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Facebook, Instagram, Phone } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';

const businessHoursSchema = z.object({
  open: z.string().optional(),
  close: z.string().optional(),
  closed: z.boolean().optional(),
});

const contactDetailsSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  facebook_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  instagram_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tiktok_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  business_hours: z.object({
    monday: businessHoursSchema,
    tuesday: businessHoursSchema,
    wednesday: businessHoursSchema,
    thursday: businessHoursSchema,
    friday: businessHoursSchema,
    saturday: businessHoursSchema,
    sunday: businessHoursSchema,
  }),
});

type ContactDetailsFormData = z.infer<typeof contactDetailsSchema>;

interface BusinessInfo {
  id: string;
  phone: string;
  business_hours: Record<string, { open?: string; close?: string; closed?: boolean }>;
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function ContactDetailsForm() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [businessInfoId, setBusinessInfoId] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactDetailsFormData>({
    resolver: zodResolver(contactDetailsSchema),
  });

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from('business_info')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setBusinessInfoId(data.id);
        reset({
          phone: data.phone,
          facebook_url: data.facebook_url || '',
          instagram_url: data.instagram_url || '',
          tiktok_url: data.tiktok_url || '',
          business_hours: data.business_hours as ContactDetailsFormData['business_hours'],
        });
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contact details',
        variant: 'destructive',
      });
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data: ContactDetailsFormData) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('business_info')
        .update({
          phone: data.phone,
          business_hours: data.business_hours,
          facebook_url: data.facebook_url || null,
          instagram_url: data.instagram_url || null,
          tiktok_url: data.tiktok_url || null,
        })
        .eq('id', businessInfoId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Contact details updated successfully',
      });
    } catch (error) {
      console.error('Error updating business info:', error);
      toast({
        title: 'Error',
        description: 'Failed to update contact details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>Manage your business contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="+1 (555) 123-4567"
              aria-invalid={errors.phone ? 'true' : 'false'}
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Update your social media profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="facebook_url" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              Facebook URL
            </Label>
            <Input
              id="facebook_url"
              type="url"
              {...register('facebook_url')}
              placeholder="https://facebook.com/yourpage"
              aria-invalid={errors.facebook_url ? 'true' : 'false'}
            />
            {errors.facebook_url && (
              <p className="text-sm text-destructive mt-1">{errors.facebook_url.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="instagram_url" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram URL
            </Label>
            <Input
              id="instagram_url"
              type="url"
              {...register('instagram_url')}
              placeholder="https://instagram.com/yourpage"
              aria-invalid={errors.instagram_url ? 'true' : 'false'}
            />
            {errors.instagram_url && (
              <p className="text-sm text-destructive mt-1">{errors.instagram_url.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="tiktok_url" className="flex items-center gap-2">
              <SiTiktok className="h-4 w-4" />
              TikTok URL
            </Label>
            <Input
              id="tiktok_url"
              type="url"
              {...register('tiktok_url')}
              placeholder="https://tiktok.com/@yourpage"
              aria-invalid={errors.tiktok_url ? 'true' : 'false'}
            />
            {errors.tiktok_url && (
              <p className="text-sm text-destructive mt-1">{errors.tiktok_url.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>Set your operating hours for each day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Label className="capitalize font-medium">{day}</Label>
              <div className="flex gap-2 md:col-span-2">
                <div className="flex-1">
                  <Label htmlFor={`${day}-open`} className="text-xs text-muted-foreground">
                    Open
                  </Label>
                  <Input
                    id={`${day}-open`}
                    type="time"
                    {...register(`business_hours.${day}.open` as any)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`${day}-close`} className="text-xs text-muted-foreground">
                    Close
                  </Label>
                  <Input
                    id={`${day}-close`}
                    type="time"
                    {...register(`business_hours.${day}.close` as any)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
