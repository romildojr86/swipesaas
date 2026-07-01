import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  let userId: string
  try {
    const body = await req.json()
    userId = body.userId
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  // Set is_premium = false
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ is_premium: false })
    .eq('id', userId)

  if (profileError) {
    console.error('[revoke-access] profile update error:', profileError)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  // Invalidate all active sessions for this user server-side
  const { error: signOutError } = await supabase.auth.admin.signOut(userId)

  if (signOutError) {
    console.error('[revoke-access] signOut error:', signOutError)
    // Profile already revoked — still return ok, session will expire naturally
  }

  return NextResponse.json({ ok: true })
}
