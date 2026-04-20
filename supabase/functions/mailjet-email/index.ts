// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const { to, subject, text, html } = await req.json();
  const MAILJET_API_KEY = Deno.env.get('MAILJET_API_KEY');
  const MAILJET_API_SECRET = Deno.env.get('MAILJET_API_SECRET');
  const FROM_EMAIL = Deno.env.get('MAILJET_FROM_EMAIL') || 'sandbox@mailjet.com';
  const FROM_NAME = Deno.env.get('MAILJET_FROM_NAME') || 'Votre Société';

  if (!MAILJET_API_KEY || !MAILJET_API_SECRET) {
    return new Response('Mailjet API credentials not set', { status: 500 });
  }

  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Messages: [
        {
          From: {
            Email: FROM_EMAIL,
            Name: FROM_NAME,
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          TextPart: text,
          HTMLPart: html,
        },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    return new Response(JSON.stringify(data), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
});
