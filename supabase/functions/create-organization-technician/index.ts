import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {

    const body = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 1. create auth user

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: body.email,
        email_confirm: true
      })

    if (authError || !authUser.user) {
      throw authError
    }

    // 2. create public.users

    const { error: userError } =
      await supabaseAdmin
        .from('users')
        .insert({
          id: authUser.user.id,
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
        })

    if (userError) {
      throw userError
    }

    // 3. create organization_members

    const { error: memberError } =
      await supabaseAdmin
        .from('organization_members')
        .insert({
          user_id: authUser.user.id,
          organization_id: body.organization_id,
          role: body.role,
          percentage_commission: body.percentage_commission,
        })

    if (memberError) {
      throw memberError
    }

    // 4. send invitation email

    await supabaseAdmin.auth.resetPasswordForEmail(
      body.email,
      {
        redirectTo: 'http://localhost:3000/reset-password'
      }
    )

    return new Response(
      JSON.stringify({
        success: true
      }),
      {
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