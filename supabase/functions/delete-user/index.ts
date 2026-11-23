import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {

  // ─────────────────────────────────────
  // Handle CORS
  // ─────────────────────────────────────

  if (req.method === 'OPTIONS') {
    return new Response(
      'ok',
      {
        headers: corsHeaders
      }
    )
  }

  try {

    // ─────────────────────────────────────
    // Parse body
    // ─────────────────────────────────────

    const body = await req.json()

    const userId = body.userId

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: 'userId is required'
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // ─────────────────────────────────────
    // Create admin client
    // ─────────────────────────────────────

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // ─────────────────────────────────────
    // Delete auth user
    // ─────────────────────────────────────

    const { error } =
      await supabaseAdmin
        .auth
        .admin
        .deleteUser(userId)

    if (error) {
      throw error
    }

    // ─────────────────────────────────────
    // Success response
    // ─────────────────────────────────────

    return new Response(
      JSON.stringify({
        success: true
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {

    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})