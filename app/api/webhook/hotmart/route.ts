import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('Webhook received:', JSON.stringify(body, null, 2))
  console.log('hottok:', body.hottok)
  console.log('email:', (body.data as Record<string, unknown> | undefined)?.buyer)

  if (body.hottok && body.hottok !== process.env.HOTMART_HOTTOK) {
    console.log('hottok mismatch — rejecting')
    return NextResponse.json({ error: 'Unauthorized', received: body.hottok }, { status: 401 })
  }

  if (body.event !== 'PURCHASE_APPROVED') {
    console.log('Skipping event:', body.event)
    return NextResponse.json({ ok: true, skipped: true, event: body.event })
  }

  const data = body.data as Record<string, unknown> | undefined
  const buyer = data?.buyer as Record<string, unknown> | undefined
  const purchase = data?.purchase as Record<string, unknown> | undefined

  const email = buyer?.email as string | undefined
  const transaction = purchase?.transaction as string | undefined

  console.log('Processing purchase — email:', email, 'transaction:', transaction)

  if (!email) {
    return NextResponse.json({ error: 'Missing buyer email', body }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('purchases')
    .upsert(
      { email: email.toLowerCase(), hotmart_transaction: transaction ?? null, status: 'approved' },
      { onConflict: 'email' }
    )

  if (error) {
    console.error('[webhook/hotmart] insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
