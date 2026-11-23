// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, subject, textContent, htmlContent, attachments } = await req.json();
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
