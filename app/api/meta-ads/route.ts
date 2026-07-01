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

  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  if (!appId || !appSecret) {
    return NextResponse.json({ error: 'META_APP_ID or META_APP_SECRET not configured' }, { status: 500 })
  }

  const token = `${appId}|${appSecret}`

  const params = new URLSearchParams({
    search_terms: searchTerm.trim(),
    ad_reached_countries: '["US","BR","MX","AR","CO"]',
    ad_type: 'ALL',
    limit: '5',
    fields: 'id,ad_creative_body,ad_creative_link_title,ad_snapshot_url,ad_delivery_start_time,publisher_platforms',
    access_token: token,
  })

  const urlWithoutToken = `https://graph.facebook.com/v19.0/ads_archive?search_terms=${encodeURIComponent(searchTerm.trim())}&ad_reached_countries=%5B%22US%22%5D&ad_type=ALL&limit=5`
  console.log('[meta-ads] Calling URL (no token):', urlWithoutToken)
  console.log('[meta-ads] APP_ID present:', !!appId, '| APP_SECRET present:', !!appSecret)

  const res = await fetch(`https://graph.facebook.com/v19.0/ads_archive?${params}`)
  const json = await res.json()

  console.log('[meta-ads] HTTP status:', res.status)
  console.log('[meta-ads] Raw response:', JSON.stringify(json, null, 2))

  if (!res.ok || json.error) {
    return NextResponse.json(
      {
        error: json.error?.message ?? 'Meta API error',
        meta_error: json.error ?? null,
        http_status: res.status,
        raw: json,
      },
      { status: 502 }
    )
  }

  const ads = ((json.data ?? []) as Record<string, unknown>[]).sort((a, b) => {
    const da = a.ad_delivery_start_time ? new Date(a.ad_delivery_start_time as string).getTime() : 0
    const db = b.ad_delivery_start_time ? new Date(b.ad_delivery_start_time as string).getTime() : 0
    return da - db
  })

  return NextResponse.json({ ads, raw: json })
}
