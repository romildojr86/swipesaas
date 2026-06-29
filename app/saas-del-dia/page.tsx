import Link from 'next/link'
import { Lock, Rocket, ArrowRight, Star } from 'lucide-react'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SaasEntry } from '@/types'

export const revalidate = 0

async function getFeatured(): Promise<SaasEntry | null> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
  const { data } = await supabase
    .from('saas_entries')
    .select('*')
    .eq('is_featured', true)
    .maybeSingle()
  return data as SaasEntry | null
}

export default async function SaasDelDiaPage() {
  const entry = await getFeatured()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {/* Background glow */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header label */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Star size={13} className="text-gold fill-gold" />
          <span className="text-gold text-xs tracking-[0.18em] uppercase font-sans">
            SaaS del Día
          </span>
          <Star size={13} className="text-gold fill-gold" />
        </div>

        {!entry ? (
          /* ── Empty state ── */
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-12 text-center">
            <div className="w-14 h-14 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center mx-auto mb-5">
              <Star size={22} className="text-gold" />
            </div>
            <h1 className="font-syne font-semibold text-white text-2xl mb-3">
              Vuelve pronto
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              El SaaS del día se actualiza cada semana. Sigue atento para descubrir el próximo análisis.
            </p>
            <Link
              href="/"
              className="inline-block mt-8 text-gold text-sm hover:text-gold-light transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        ) : (
          /* ── Featured SaaS card ── */
          <div
            className="bg-[#111111] rounded-2xl overflow-hidden"
            style={{
              border: '1px solid rgba(201,168,76,0.2)',
              boxShadow: '0 0 60px rgba(201,168,76,0.08)',
            }}
          >
            {/* Cover */}
            <div className="relative w-full h-48 bg-[#0d0d0d] flex items-center justify-center overflow-hidden">
              {entry.cover_url ? (
                <img
                  src={entry.cover_url}
                  alt={entry.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">{entry.emoji || '🚀'}</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
            </div>

            <div className="px-7 pb-7 -mt-4">
              {/* Name + badges */}
              <h1 className="font-syne font-bold text-white text-2xl mb-3">
                {entry.nome}
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs text-gold/80 px-2.5 py-1 bg-gold/8 border border-gold/15 rounded-full">
                  {entry.nicho}
                </span>
                <span className="text-xs text-text-secondary px-2.5 py-1 bg-white/4 border border-white/8 rounded-full">
                  {entry.pais_origen}
                </span>
                <span className="text-xs text-text-secondary px-2.5 py-1 bg-white/4 border border-white/8 rounded-full">
                  {entry.modelo_preco}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 px-2.5 py-1 bg-emerald-500/8 border border-emerald-500/15 rounded-full">
                  <Rocket size={10} />
                  Escalando
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/5 mb-6" />

              {/* Blurred premium info */}
              <div className="space-y-3 mb-7">
                {[
                  { label: 'MRR Estimado', value: entry.mrr || '$42K+' },
                  { label: 'Precio', value: entry.precio ? `${entry.moneda || 'USD'} ${entry.precio}` : 'Desde $29/mes' },
                  { label: 'Link de anuncios', value: entry.link_anuncios || 'Ver biblioteca de ads' },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between bg-[#0d0d0d] border border-white/5 rounded-lg px-4 py-3"
                  >
                    <span className="text-xs text-text-secondary uppercase tracking-wider">{label}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm text-white font-medium select-none"
                        style={{ filter: 'blur(5px)', userSelect: 'none' }}
                      >
                        {value}
                      </span>
                      <Lock size={12} className="text-text-muted shrink-0" />
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="https://pay.hotmart.com/S106537389G?checkoutMode=10"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex items-center justify-center gap-2 w-full py-4 rounded-xl text-[#0a0a0a] font-semibold text-sm"
              >
                Ver análisis completo
                <ArrowRight size={15} />
              </a>

              <p className="text-center text-xs text-text-muted mt-4">
                ¿Ya eres premium?{' '}
                <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
                  Inicia sesión →
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
