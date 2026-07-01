import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  let searchTerm: string
  try {
    const body = await req.json()
    searchTerm = body.searchTerm
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!searchTerm?.trim()) {
    return NextResponse.json({ error: 'Missing searchTerm' }, { status: 400 })
  }

  const token = process.env.META_ADS_TOKEN
  if (!token || token === 'seu_token_aqui') {
    return NextResponse.json({ error: 'META_ADS_TOKEN not configured' }, { status: 500 })
  }

  const params = new URLSearchParams({
    search_terms: searchTerm.trim(),
    ad_reached_countries: JSON.stringify(['BR', 'US', 'MX', 'AR', 'CO']),
    ad_type: 'ALL',
    limit: '20',
    fields: [
      'id',
      'ad_creative_body',
      'ad_creative_link_title',
      'ad_snapshot_url',
      'ad_delivery_start_time',
      'ad_delivery_stop_time',
      'publisher_platforms',
      'impressions',
      'spend',
    ].join(','),
    access_token: token,
  })

  const res = await fetch(`https://graph.facebook.com/v19.0/ads_archive?${params}`)
  const json = await res.json()

  if (!res.ok || json.error) {
    console.error('[meta-ads] API error:', json.error)
    return NextResponse.json(
      { error: json.error?.message ?? 'Meta API error', detail: json.error },
      { status: 502 }
    )
  }

  const ads = ((json.data ?? []) as Record<string, unknown>[]).sort((a, b) => {
    const da = a.ad_delivery_start_time ? new Date(a.ad_delivery_start_time as string).getTime() : 0
    const db = b.ad_delivery_start_time ? new Date(b.ad_delivery_start_time as string).getTime() : 0
    return da - db
  })

  return NextResponse.json({ ads })
}
