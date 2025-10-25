import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
  service_id: string;
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

    console.log("Syncing lead to CRM:", lead.name);

    // Replace with your actual CRM API endpoint and credentials
    const CRM_API_URL = Deno.env.get("CRM_API_URL");
    const CRM_API_KEY = Deno.env.get("CRM_API_KEY");

    if (!CRM_API_URL || !CRM_API_KEY) {
      console.warn("CRM credentials not configured, skipping sync");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "CRM not configured" 
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Send to CRM API
    const crmResponse = await fetch(CRM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CRM_API_KEY}`,
      },
      body: JSON.stringify({
        contact: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          city: lead.city,
          source: "website_contact_form",
          tags: ["lead", "cleaning_services"],
        },
      }),
    });

    if (!crmResponse.ok) {
      throw new Error(`CRM API error: ${crmResponse.statusText}`);
    }

    const crmData = await crmResponse.json();
    console.log("CRM sync successful:", crmData);

    // Log the sync result in Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabase.from("crm_sync_log").insert({
      lead_email: lead.email,
      crm_id: crmData.id || null,
      status: "success",
      synced_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        crm_id: crmData.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in sync-lead-to-crm function:", error);

    // Log the failed sync
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      const { lead } = await req.json();
      await supabase.from("crm_sync_log").insert({
        lead_email: lead.email,
        status: "failed",
        error_message: error.message,
        synced_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error("Error logging sync failure:", logError);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
