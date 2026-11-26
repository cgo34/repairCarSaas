import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const ALLOWED_ROLES = ['admin', 'manager', 'technician'] as const
type OrganizationRole = typeof ALLOWED_ROLES[number]

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })

serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  let createdAuthUserId: string | null = null

  try {
    const body = await req.json()

    // 0. authenticate and authorize the caller (never trust the client)

    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
    if (!token) throw new HttpError(401, 'Missing authorization token')

    const { data: callerData, error: callerError } = await supabaseAdmin.auth.getUser(token)
    if (callerError || !callerData.user) throw new HttpError(401, 'Invalid token')
    const callerId = callerData.user.id

    const role = body.role as OrganizationRole
    if (!ALLOWED_ROLES.includes(role)) throw new HttpError(400, 'Invalid role')
    if (!body.organization_id || !body.email) throw new HttpError(400, 'Missing organization_id or email')

    const { data: callerMembership, error: membershipError } = await supabaseAdmin
      .from('organization_members')
      .select('role')
      .eq('user_id', callerId)
      .eq('organization_id', body.organization_id)
      .eq('status', 'active')
      .maybeSingle()

    if (membershipError) throw membershipError

    const callerRole = callerMembership?.role
    if (callerRole !== 'admin' && callerRole !== 'manager') {
      throw new HttpError(403, 'Not allowed to invite members in this organization')
    }
    // A manager may only invite technicians
    if (callerRole === 'manager' && role !== 'technician') {
      throw new HttpError(403, 'Managers can only invite technicians')
    }

    // 1. create auth user: the on_auth_user_created trigger creates public.users
    //    from user_metadata (first_name, last_name, fullName)

    const fullName = [body.first_name, body.last_name].filter(Boolean).join(' ').trim()

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: body.email,
        email_confirm: true,
        user_metadata: {
          first_name: body.first_name ?? '',
          last_name: body.last_name ?? '',
          fullName
        }
      })

    if (authError || !authUser.user) {
      throw authError ?? new Error('Auth user creation failed')
    }
    createdAuthUserId = authUser.user.id

    // 2. create organization_members

    const { data: createdMember, error: memberError } =
      await supabaseAdmin
        .from('organization_members')
        .insert({
          user_id: authUser.user.id,
          organization_id: body.organization_id,
          role,
          percentage_commission: body.percentage_commission,
          created_by: callerId,
        })
        .select(`
          id,
          user_id,
          organization_id,
          role,
          percentage_commission,
          status,
          users (
            first_name,
            last_name,
            email
          )
        `)
        .single()

    if (memberError) {
      throw memberError
    }

    // 3. send invitation email

    const appUrl = req.headers.get('origin') ?? Deno.env.get('SITE_URL')
    if (!appUrl) throw new Error('SITE_URL is not configured')

    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(
      body.email,
      { redirectTo: `${appUrl.replace(/\/$/, '')}/reset-password` }
    )
    if (resetError) throw resetError

    createdAuthUserId = null

    return json({ success: true, member: createdMember })
  } catch (error) {
    // Compensation: the auth deletion cascades to public.users and organization_members
    if (createdAuthUserId) {
      await supabaseAdmin.auth.admin.deleteUser(createdAuthUserId)
    }

    const status = error instanceof HttpError ? error.status : 500
    return json({ error: error.message }, status)
  }
})
