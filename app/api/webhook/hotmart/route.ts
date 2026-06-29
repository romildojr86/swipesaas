import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const hottok = req.headers.get('hottok')
  if (hottok !== process.env.HOTMART_HOTTOK) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = (body as Record<string, unknown>)?.event as string | undefined
  if (event !== 'PURCHASE_APPROVED') {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const data = (body as Record<string, unknown>)?.data as Record<string, unknown> | undefined
  const buyer = data?.buyer as Record<string, unknown> | undefined
  const purchase = data?.purchase as Record<string, unknown> | undefined

  const email = buyer?.email as string | undefined
  const transaction = purchase?.transaction as string | undefined

  if (!email) {
    return NextResponse.json({ error: 'Missing buyer email' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('purchases')
    .upsert({ email, hotmart_transaction: transaction ?? null, status: 'approved' }, { onConflict: 'email' })

  if (error) {
    console.error('[webhook/hotmart] insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
