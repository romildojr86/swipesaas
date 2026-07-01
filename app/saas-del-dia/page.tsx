import Link from 'next/link'
import { Lock, ExternalLink, Megaphone, Star } from 'lucide-react'
import type { MetaAd } from '@/types'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SaasEntry } from '@/types'

export const revalidate = 0

const PLATFORM_LABEL: Record<string, string> = {
  facebook: 'FB', instagram: 'IG', messenger: 'MSG', whatsapp: 'WA',
}

function AdCardStatic({ ad }: { ad: MetaAd }) {
  const platforms = ad.publisher_platforms?.slice(0, 2) ?? []
  const date = ad.ad_delivery_start_time
    ? new Date(ad.ad_delivery_start_time).toLocaleDateString('es', { day: '2-digit', month: 'short' })
    : null
  const body = ad.ad_creative_body || ad.ad_creative_link_title || ''

  return (
    <a
      href={ad.ad_snapshot_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-1.5 bg-[#0d0d0d] border border-white/5 rounded-lg p-3 hover:border-gold/20 transition-colors"
    >
      <div className="flex items-center gap-1 flex-wrap">
        {platforms.map((p) => (
          <span key={p} className="text-[8px] text-text-muted bg-white/5 border border-white/8 rounded px-1.5 py-0.5 uppercase tracking-wider">
            {PLATFORM_LABEL[p] ?? p}
          </span>
        ))}
        {date && <span className="text-[8px] text-text-muted ml-auto">{date}</span>}
      </div>
      {body && <p className="text-[10px] text-text-secondary leading-snug line-clamp-2">{body}</p>}
      <span className="text-[9px] text-gold/50 flex items-center gap-0.5 mt-auto">
        <ExternalLink size={8} />
        Ver anuncio
      </span>
    </a>
  )
}

const FLAG_MAP: Record<string, string> = {
  'Estados Unidos': '🇺🇸', 'Brasil': '🇧🇷', 'México': '🇲🇽', 'Argentina': '🇦🇷',
  'Colombia': '🇨🇴', 'Chile': '🇨🇱', 'Perú': '🇵🇪', 'España': '🇪🇸',
  'Reino Unido': '🇬🇧', 'Alemania': '🇩🇪', 'Francia': '🇫🇷', 'Canadá': '🇨🇦',
  'Australia': '🇦🇺', 'Países Bajos': '🇳🇱', 'Suecia': '🇸🇪', 'Portugal': '🇵🇹',
  'India': '🇮🇳', 'Japón': '🇯🇵', 'Corea del Sur': '🇰🇷', 'Uruguay': '🇺🇾',
}

async function getPageData() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const [{ data: featured }, { count: totalCount }, { data: { user } }] = await Promise.all([
    supabase.from('saas_entries').select('*').eq('is_featured', true).maybeSingle(),
    supabase.from('saas_entries').select('*', { count: 'exact', head: true }),
    supabase.auth.getUser(),
  ])

  let isPremium = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium, is_admin')
      .eq('id', user.id)
      .single()
    isPremium = profile?.is_premium || profile?.is_admin || false
  }

  return { entry: featured as SaasEntry | null, isPremium, totalCount: totalCount ?? 0 }
}

export default async function SaasDelDiaPage() {
  const { entry, isPremium, totalCount } = await getPageData()

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Page title */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Star size={12} className="text-gold fill-gold" />
          <span className="text-gold text-[10px] tracking-[0.2em] uppercase font-sans font-medium">
            SaaS del Día
          </span>
          <Star size={12} className="text-gold fill-gold" />
        </div>

        {!entry ? (
          /* ── Empty state ── */
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-12 text-center">
            <div className="w-14 h-14 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center mx-auto mb-5">
              <Star size={22} className="text-gold" />
            </div>
            <h1 className="font-syne font-semibold text-white text-2xl mb-3">Vuelve pronto</h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              El SaaS del día se actualiza cada semana.
            </p>
            <Link href="/" className="inline-block mt-8 text-gold text-sm hover:text-gold-light transition-colors">
              ← Volver al inicio
            </Link>
          </div>
        ) : (
          <>
            {/* ── Card ── */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: '#111111',
                border: '1px solid rgba(201,168,76,0.18)',
                boxShadow: '0 0 48px rgba(201,168,76,0.07)',
              }}
            >
              {/* Cover image */}
              <div className="relative w-full overflow-hidden bg-[#0d0d0d]" style={{ height: 300 }}>
                {entry.cover_url ? (
                  <img
                    src={entry.cover_url}
                    alt={entry.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-7xl">{entry.emoji || '🚀'}</span>
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent" />

                {/* Badge top-left */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#0a0a0a]/80 backdrop-blur-sm border border-gold/30 rounded-full px-2.5 py-1">
                  <Star size={9} className="text-gold fill-gold" />
                  <span className="text-gold text-[9px] tracking-[0.15em] uppercase font-semibold">
                    SaaS del Día
                  </span>
                </div>

                {/* Country badge top-right */}
                <div className="absolute top-3 right-3 bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1">
                  <span className="text-xs">
                    {FLAG_MAP[entry.pais_origen] ?? '🌎'} {entry.pais_origen}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Name */}
                <h1 className="font-syne font-bold text-white mb-5" style={{ fontSize: '1.5rem' }}>
                  {entry.nome}
                </h1>

                {/* Metric cards — MRR + Precio side by side */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: 'MRR Estimado', value: entry.mrr || '$42K+' },
                    { label: 'Precio', value: entry.precio ? `${entry.moneda || 'USD'} ${entry.precio}` : '$29/mes' },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-[#0d0d0d] border border-white/5 rounded-xl p-3.5"
                    >
                      <p className="text-[9px] text-text-muted uppercase tracking-[0.12em] mb-1.5">{label}</p>
                      {isPremium ? (
                        <p className="text-white font-semibold text-sm">{value}</p>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <p
                            className="text-white font-semibold text-sm select-none"
                            style={{ filter: 'blur(5px)', userSelect: 'none' }}
                          >
                            {value}
                          </p>
                          <Lock size={10} className="text-text-muted shrink-0" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Info rows */}
                <div className="space-y-0 border border-white/5 rounded-xl overflow-hidden mb-5">
                  {[
                    { label: 'Nicho', value: entry.nicho },
                    { label: 'Modelo', value: entry.modelo_preco },
                    { label: 'País', value: `${FLAG_MAP[entry.pais_origen] ?? '🌎'} ${entry.pais_origen}` },
                  ].map(({ label, value }, i, arr) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between px-4 py-3 bg-[#0d0d0d] ${
                        i < arr.length - 1 ? 'border-b border-white/5' : ''
                      }`}
                    >
                      <span className="text-[10px] text-text-muted uppercase tracking-wider">{label}</span>
                      <span className="text-sm text-white/80 font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Action buttons — Ver sitio + Ver anuncios */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Ver sitio */}
                  {entry.link_site ? (
                    <a
                      href={entry.link_site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-white/8 text-text-secondary hover:text-white hover:border-white/20 transition-colors"
                    >
                      <ExternalLink size={15} />
                      <span className="text-[10px] leading-none">Ver sitio</span>
                    </a>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-white/5 text-text-muted cursor-not-allowed opacity-40">
                      <ExternalLink size={15} />
                      <span className="text-[10px] leading-none">Ver sitio</span>
                    </div>
                  )}

                  {/* Ver anuncios — blurred if not premium */}
                  {isPremium && entry.link_anuncios ? (
                    <a
                      href={entry.link_anuncios}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-white/8 text-text-secondary hover:text-white hover:border-white/20 transition-colors"
                    >
                      <Megaphone size={15} />
                      <span className="text-[10px] leading-none">Ver anuncios</span>
                    </a>
                  ) : (
                    <div className="relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-white/8 text-text-muted cursor-not-allowed overflow-hidden">
                      <Megaphone size={15} />
                      <span className="text-[10px] leading-none">Ver anuncios</span>
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0d0d0d]/60 backdrop-blur-[2px]">
                        <Lock size={11} className="text-text-muted" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Ads section ── */}
            {(entry.ads_data ?? []).length > 0 && (
              <div className="mt-4 rounded-2xl overflow-hidden" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Megaphone size={12} className="text-gold" />
                    <span className="text-xs text-text-secondary uppercase tracking-wider">Anuncios activos</span>
                  </div>
                  <span className="text-[10px] text-text-muted bg-white/5 border border-white/8 rounded-full px-2 py-0.5">
                    {entry.ads_count}
                  </span>
                </div>
                <div className="relative p-4">
                  <div className={`grid grid-cols-2 gap-2 ${!isPremium ? 'pointer-events-none' : ''}`}>
                    {(entry.ads_data ?? []).slice(0, 6).map((ad) => (
                      <AdCardStatic key={ad.id} ad={ad} />
                    ))}
                  </div>
                  {!isPremium && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-b-2xl"
                      style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(6px)' }}>
                      <Lock size={18} className="text-gold mb-2" />
                      <p className="text-white text-xs font-semibold mb-1">Contenido premium</p>
                      <p className="text-text-muted text-[10px] mb-3 text-center px-6">Accede a todos los anuncios con tu membresía</p>
                      <a
                        href="https://pay.hotmart.com/S106537389G?checkoutMode=10"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold text-[10px] font-semibold text-[#0a0a0a] px-4 py-2 rounded-lg"
                      >
                        ⭐ Quiero acceso premium
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Upgrade block (always visible) ── */}
            <div
              className="mt-4 rounded-2xl p-6 text-center"
              style={{
                background: '#0f0e09',
                border: '1px solid rgba(201,168,76,0.25)',
                boxShadow: '0 0 40px rgba(201,168,76,0.05)',
              }}
            >
              <p className="font-syne font-semibold text-white text-base mb-2 leading-snug">
                ¿Quieres acceso a más de {totalCount}+ SaaS escalados?
              </p>
              <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                Accede al catálogo completo — mecanismo, precio, MRR y anuncios de cada SaaS.
              </p>
              <a
                href="https://pay.hotmart.com/S106537389G?checkoutMode=10"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[#0a0a0a] font-semibold text-sm"
              >
                <Star size={13} className="fill-[#0a0a0a]" />
                Quiero acceso premium →
              </a>
              <p className="text-xs text-text-muted mt-4">
                ¿Ya eres premium?{' '}
                <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
                  Inicia sesión →
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
