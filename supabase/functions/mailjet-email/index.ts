// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const FEATURE_BY_DOCUMENT_TYPE: Record<string, string> = {
  quote: 'quote_email_sending',
  invoice: 'invoice_email_sending',
};

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, subject, textContent, htmlContent, attachments, documentType, organizationId } = await req.json();

    // Server-side plan guard: the UI hides the buttons, this makes the rule unbypassable
    const feature = FEATURE_BY_DOCUMENT_TYPE[documentType];
    if (!feature || !organizationId) {
      return jsonResponse({ error: 'documentType and organizationId are required' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const { data: allowed, error: accessError } = await supabase.rpc('can_use_feature', {
      p_organization_id: organizationId,
      p_feature: feature,
    });
    if (accessError) {
      console.error('Feature check error:', accessError);
      return jsonResponse({ error: 'Feature check failed' }, 500);
    }
    if (!allowed) {
      return jsonResponse({ error: `FEATURE_NOT_AVAILABLE: ${feature}` }, 403);
    }

    const MAILJET_API_KEY = Deno.env.get('MAILJET_API_KEY');
    const MAILJET_API_SECRET = Deno.env.get('MAILJET_API_SECRET');
    const FROM_EMAIL = Deno.env.get('MAILJET_FROM_EMAIL') || 'sandbox@mailjet.com';
    const FROM_NAME = Deno.env.get('MAILJET_FROM_NAME') || 'Votre Société';

    if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
      return new Response(JSON.stringify({ error: 'Mailjet API credentials not set' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Build message object
    const message: Record<string, unknown> = {
      From: {
        Email: FROM_EMAIL,
        Name: FROM_NAME,
      },
      To: [{ Email: to }],
      Subject: subject,
      TextPart: textContent,
      HTMLPart: htmlContent,
    };

    // Add attachments if present
    if (attachments && attachments.length > 0) {
      message.Attachments = attachments.map((att: { content: string; filename: string; contentType: string }) => ({
        ContentType: att.contentType,
        Filename: att.filename,
        Base64Content: att.content,
      }));
    }

    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Messages: [message] }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Mailjet error:', data);
      return new Response(JSON.stringify(data), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
