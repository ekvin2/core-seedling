import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Lead {
  name: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  message?: string;
}

interface RequestBody {
  lead: Lead;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lead }: RequestBody = await req.json();

    console.log("Sending lead notification email for:", lead.name);

    const emailResponse = await resend.emails.send({
      from: "Cleaning Services <notify@easyhousewash.co.nz>",
      to: ["rojithonline@gmail.com"],
      subject: `New Lead: ${lead.name} - ${lead.service}`,
      html: `
        <h2>New Lead Submission</h2>
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p><strong>Name:</strong> ${lead.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
          <p><strong>City:</strong> ${lead.city}</p>
          <p><strong>Service Requested:</strong> ${lead.service}</p>
          ${lead.message ? `<p><strong>Message:</strong><br/>${lead.message}</p>` : ''}
          <hr style="margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            This email was sent from your Cleaning Services website contact form.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-lead-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
