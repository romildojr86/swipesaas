'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, LogOut, Database, Tag, Globe, RefreshCw,
  ChevronDown, X, ExternalLink, Megaphone, ChevronLeft, ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { SaasEntry, MetaAd } from '@/types'
import { calcularMetricas, formatarAlcance, formatarInvestimento } from '@/lib/ads-calculations'

const flagMap: Record<string, string> = {
  'Estados Unidos': '🇺🇸', Brasil: '🇧🇷', 'México': '🇲🇽', Argentina: '🇦🇷',
  Colombia: '🇨🇴', Chile: '🇨🇱', 'Perú': '🇵🇪', 'España': '🇪🇸',
  'Reino Unido': '🇬🇧', Alemania: '🇩🇪', Francia: '🇫🇷', 'Canadá': '🇨🇦',
  Australia: '🇦🇺', 'Países Bajos': '🇳🇱', Holanda: '🇳🇱', Suecia: '🇸🇪',
  Dinamarca: '🇩🇰', Finlandia: '🇫🇮', Noruega: '🇳🇴', Portugal: '🇵🇹',
  India: '🇮🇳', 'Japón': '🇯🇵', 'Corea del Sur': '🇰🇷', Bulgaria: '🇧🇬',
  'Bélgica': '🇧🇪', Estonia: '🇪🇪', Uruguay: '🇺🇾', Ecuador: '🇪🇨',
  Paraguay: '🇵🇾', Bolivia: '🇧🇴', Venezuela: '🇻🇪', 'Panamá': '🇵🇦',
  'Costa Rica': '🇨🇷', Guatemala: '🇬🇹', 'República Dominicana': '🇩🇴',
}

const monedaSymbol: Record<string, string> = {
  USD: '$', BRL: 'R$', EUR: '€', MXN: 'MX$', ARS: 'AR$', COP: 'COP$', CLP: 'CLP$',
}

const nichoGlow: Record<string, string> = {
  Productividad: 'rgba(139,92,246,0.14)', Marketing: 'rgba(234,88,12,0.14)',
  Finanzas: 'rgba(16,185,129,0.14)', 'Educación': 'rgba(59,130,246,0.14)',
  Salud: 'rgba(236,72,153,0.14)', 'E-commerce': 'rgba(245,158,11,0.14)',
  'Dev Tools': 'rgba(99,102,241,0.14)', Analytics: 'rgba(20,184,166,0.14)',
  Formularios: 'rgba(168,85,247,0.14)', Pagamentos: 'rgba(201,168,76,0.14)',
  'Redes Sociales': 'rgba(14,165,233,0.14)', Otros: 'rgba(100,116,139,0.14)',
}

const PLATFORM_LABEL: Record<string, string> = {
  facebook: 'FB', instagram: 'IG', messenger: 'MSG', whatsapp: 'WA', audience_network: 'AN',
}

function formatAdDate(iso?: string) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('es', { day: '2-digit', month: 'short', year: '2-digit' })
}

function AdCard({ ad }: { ad: MetaAd }) {
  const platforms = ad.publisher_platforms?.slice(0, 3) ?? []
  const date = formatAdDate(ad.ad_delivery_start_time)
  const body = ad.ad_creative_body || ad.ad_creative_link_title || ''

  return (
    <a
      href={ad.ad_snapshot_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 bg-[#0a0a0a] border border-white/5 rounded-lg p-3 hover:border-gold/20 transition-colors"
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        {platforms.map((p) => (
          <span key={p} className="text-[9px] text-text-muted bg-white/5 border border-white/8 rounded px-1.5 py-0.5 uppercase tracking-wider">
            {PLATFORM_LABEL[p] ?? p}
          </span>
        ))}
        {date && <span className="text-[9px] text-text-muted ml-auto">{date}</span>}
      </div>
      {body && <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{body}</p>}
      <span className="text-[9px] text-gold/60 group-hover:text-gold transition-colors flex items-center gap-0.5 mt-auto">
        <ExternalLink size={9} />
        Ver anuncio
      </span>
    </a>
  )
}

// ── Pagination ──────────────────────────────────────────────────────────────

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const show = new Set<number>()
  show.add(1)
  show.add(total)
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) show.add(i)

  const sorted = Array.from(show).sort((a, b) => a - b)
  const result: (number | 'ellipsis')[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('ellipsis')
    result.push(sorted[i])
  }
  return result
}

interface PaginationProps {
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (p: number) => void
}

function Pagination({ page, totalPages, totalCount, pageSize, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalCount)
  const pages = getPageNumbers(page, totalPages)

  const btnBase =
    'h-8 min-w-[2rem] px-2 rounded-lg text-xs font-medium flex items-center justify-center transition-all duration-150'

  return (
    <div className="flex flex-col items-center gap-3 mt-10">
      <p className="text-[11px] text-text-muted">
        Mostrando <span className="text-white">{from}–{to}</span> de{' '}
        <span className="text-white">{totalCount}</span> SaaS
      </p>

      <div className="flex items-center gap-1">
        {/* Anterior */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`${btnBase} gap-1 px-3 border border-white/8 text-text-secondary hover:text-white hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <ChevronLeft size={13} />
          Anterior
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((p, i) =>
            p === 'ellipsis' ? (
              <span key={`el-${i}`} className="text-text-muted text-xs px-1">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`${btnBase} border ${
                  p === page
                    ? 'bg-gold text-[#0a0a0a] border-gold font-semibold'
                    : 'border-white/8 text-text-secondary hover:text-white hover:border-white/20'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Siguiente */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`${btnBase} gap-1 px-3 border border-white/8 text-text-secondary hover:text-white hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          Siguiente
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}

// ── Props ────────────────────────────────────────────────────────────────────

interface CurrentFilters {
  nicho: string
  pais: string
  modelo: string
  q: string
}

interface Props {
  entries: SaasEntry[]
  nichos: string[]
  paises: string[]
  modelos: string[]
  userEmail: string
  isPremium: boolean
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  lastUpdated: string
  currentFilters: CurrentFilters
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function CatalogoClient({
  entries,
  nichos,
  paises,
  modelos,
  userEmail,
  isPremium,
  page,
  totalPages,
  totalCount,
  pageSize,
  lastUpdated,
  currentFilters,
}: Props) {
  // Local state — mirrors URL, gives instant feedback before navigation
  const [nichoFilter, setNichoFilter] = useState(currentFilters.nicho)
  const [paisFilter, setPaisFilter] = useState(currentFilters.pais)
  const [modeloFilter, setModeloFilter] = useState(currentFilters.modelo)
  const [search, setSearch] = useState(currentFilters.q)
  const [selectedEntry, setSelectedEntry] = useState<SaasEntry | null>(null)

  const router = useRouter()
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const catalogRef = useRef<HTMLDivElement>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Build URL and navigate
  const navigate = useCallback(
    (overrides: Partial<CurrentFilters & { page: number }>) => {
      const merged = {
        nicho: nichoFilter,
        pais: paisFilter,
        modelo: modeloFilter,
        q: search,
        page: 1,
        ...overrides,
      }
      const params = new URLSearchParams()
      if (merged.q) params.set('q', merged.q)
      if (merged.nicho !== 'Todos') params.set('nicho', merged.nicho)
      if (merged.pais !== 'Todos') params.set('pais', merged.pais)
      if (merged.modelo !== 'Todos') params.set('modelo', merged.modelo)
      if (merged.page > 1) params.set('page', merged.page.toString())
      const qs = params.toString()
      router.push(`/catalogo${qs ? `?${qs}` : ''}`)
    },
    [nichoFilter, paisFilter, modeloFilter, search, router]
  )

  const handleSearch = (value: string) => {
    setSearch(value)
    if (searchDebounce.current) clearTimeout(searchDebounce.current)
    searchDebounce.current = setTimeout(() => navigate({ q: value, page: 1 }), 400)
  }

  const handleNicho = (value: string) => {
    setNichoFilter(value)
    navigate({ nicho: value, page: 1 })
  }

  const handlePais = (value: string) => {
    setPaisFilter(value)
    navigate({ pais: value, page: 1 })
  }

  const handleModelo = (value: string) => {
    setModeloFilter(value)
    navigate({ modelo: value, page: 1 })
  }

  const handlePageChange = (p: number) => {
    navigate({ page: p })
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  // Counts for stat cards derived from all available option lists
  const nichoCount = nichos.length - 1
  const paisCount = paises.length - 1

  const statCards = [
    { label: 'Total SaaS', value: totalCount.toString(), icon: <Database size={15} />, isText: false },
    { label: 'Nichos', value: nichoCount.toString(), icon: <Tag size={15} />, isText: false },
    { label: 'Países', value: paisCount.toString(), icon: <Globe size={15} />, isText: false },
    { label: 'Última actualización', value: lastUpdated, icon: <RefreshCw size={15} />, isText: true },
  ]

  const dropdowns = useMemo(() => [
    { value: nichoFilter, handler: handleNicho, options: nichos, placeholder: 'Todos los nichos' },
    { value: paisFilter, handler: handlePais, options: paises, placeholder: 'Todos los países' },
    { value: modeloFilter, handler: handleModelo, options: modelos, placeholder: 'Todos los modelos' },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [nichoFilter, paisFilter, modeloFilter, nichos, paises, modelos])

  return (
    <main className="min-h-screen">
      {/* Sticky header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-sm bg-gold-gradient flex items-center justify-center">
              <span className="text-[#0a0a0a] font-bold text-xs font-syne">S</span>
            </div>
            <span className="font-syne font-semibold text-lg text-white">SwipeSaaS</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-text-secondary text-sm hidden sm:block truncate max-w-[200px]">
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="text-text-secondary hover:text-white transition-colors p-1.5"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7"
        >
          <h1 className="font-syne font-semibold text-white text-4xl mb-1">Catálogo</h1>
          <p className="text-text-secondary text-sm">{totalCount} SaaS disponibles</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7"
        >
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#111111] border border-white/5 rounded-xl p-4 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gold/8 border border-gold/12 flex items-center justify-center text-gold shrink-0">
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className={`font-syne font-semibold text-white leading-none mb-0.5 ${stat.isText ? 'text-base' : 'text-2xl'}`}>
                  {stat.value}
                </p>
                <p className="text-text-secondary text-xs truncate">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3 mb-8"
        >
          <div className="relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nombre, nicho o país..."
              className="w-full bg-[#111111] border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {dropdowns.map(({ value, handler, options, placeholder }) => (
              <div key={placeholder} className="relative">
                <select
                  value={value}
                  onChange={(e) => handler(e.target.value)}
                  className="w-full bg-[#111111] border border-white/8 rounded-xl px-4 py-3 pr-9 text-text-secondary text-sm focus:outline-none focus:border-gold/40 appearance-none transition-colors"
                >
                  <option value="Todos">{placeholder}</option>
                  {options.filter((o) => o !== 'Todos').map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cards grid */}
        <div ref={catalogRef}>
          {entries.length === 0 ? (
            <div className="text-center py-20 text-text-secondary text-sm">
              No se encontraron resultados para tu búsqueda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {entries.map((entry, i) => {
                const emoji = entry.emoji || entry.nome[0]
                const flag = flagMap[entry.pais_origen] ?? ''
                const glow = nichoGlow[entry.nicho] ?? 'rgba(201,168,76,0.10)'

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4 }}
                    className="group flex flex-col bg-[#111111] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.38)]"
                  >
                    <div
                      className="relative h-[180px] flex items-center justify-center overflow-hidden shrink-0"
                      style={{ background: '#161616' }}
                    >
                      {entry.cover_url ? (
                        <img src={entry.cover_url} alt={entry.nome} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <>
                          <div
                            className="absolute inset-0"
                            style={{ background: `radial-gradient(ellipse 75% 75% at 50% 65%, ${glow} 0%, transparent 70%)` }}
                          />
                          <span className="relative z-10 select-none" style={{ fontSize: 56, lineHeight: 1 }}>{emoji}</span>
                        </>
                      )}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-black/50 border border-gold/25 rounded-full px-2.5 py-1 backdrop-blur-sm">
                        <span className="text-[10px] leading-none">🚀</span>
                        <span className="text-[10px] text-gold font-medium tracking-wide leading-none">Escalando</span>
                      </div>
                      {(entry.ads_count ?? 0) > 0 && (
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/50 border border-white/15 rounded-full px-2 py-1 backdrop-blur-sm">
                          <Megaphone size={9} className="text-text-muted" />
                          <span className="text-[9px] text-text-muted">{entry.ads_count}</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#111111] to-transparent" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%)' }} />
                    </div>

                    <div className="flex flex-col flex-1 p-4 gap-3">
                      <div>
                        <h3 className="text-white font-semibold text-[1.05rem] leading-snug truncate mb-0.5">{entry.nome}</h3>
                        <p className="text-text-muted text-xs">{flag} {entry.pais_origen}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-2.5 py-2 text-center">
                          <p className="text-[9px] text-text-muted mb-0.5 uppercase tracking-widest">Modelo</p>
                          <p className="text-[11px] text-text-secondary font-medium truncate">{entry.modelo_preco}</p>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-2.5 py-2 text-center">
                          <p className="text-[9px] text-text-muted mb-0.5 uppercase tracking-widest">Nicho</p>
                          <p className="text-[11px] text-gold/80 font-medium truncate">{entry.nicho}</p>
                        </div>
                      </div>
                      {entry.precio && (
                        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-2.5 py-2 text-center">
                          <p className="text-[9px] text-text-muted mb-0.5 uppercase tracking-widest">Precio</p>
                          <p className="text-[11px] text-white font-semibold truncate">
                            {monedaSymbol[entry.moneda] ?? ''}{entry.precio}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="mt-auto w-full py-2 rounded-lg border border-gold/30 text-gold text-[11px] font-semibold hover:bg-gold/8 hover:border-gold/50 transition-colors"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Details modal */}
      <AnimatePresence>
        {selectedEntry && (() => {
          const e = selectedEntry
          const emoji = e.emoji || e.nome[0]
          const flag = flagMap[e.pais_origen] ?? ''
          const ads = (e.ads_data ?? []).slice(0, 12)

          return (
            <motion.div
              key="details-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={(ev) => { if (ev.target === ev.currentTarget) setSelectedEntry(null) }}
            >
              <motion.div
                key="details-card"
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-[#111111] border border-gold/20 rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto"
                style={{ boxShadow: '0 0 60px rgba(201,168,76,0.08), 0 24px 60px rgba(0,0,0,0.6)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent z-10" />

                {e.cover_url && (
                  <div className="relative w-full h-[200px] overflow-hidden">
                    <img src={e.cover_url} alt={e.nome} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111111]/80 pointer-events-none" />
                  </div>
                )}

                <div className="flex items-center gap-4 px-6 pt-5 pb-5">
                  {!e.cover_url && (
                    <span className="select-none shrink-0" style={{ fontSize: 48, lineHeight: 1 }}>{emoji}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-syne font-bold text-white text-2xl leading-tight truncate">{e.nome}</h2>
                    <p className="text-text-secondary text-sm mt-0.5">{flag} {e.pais_origen}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="shrink-0 text-text-secondary hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 self-start"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="h-px bg-white/5 mx-6" />

                <div className="px-6 py-5 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-4">
                      <p className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5"><span>💰</span> MRR</p>
                      <p className="text-gold font-syne font-bold text-lg leading-none">{e.mrr || '—'}</p>
                    </div>
                    <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-4">
                      <p className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5"><span>💵</span> Precio</p>
                      <p className="text-white font-semibold text-sm leading-snug">
                        {e.precio ? `${monedaSymbol[e.moneda] ?? ''}${e.precio}` : '—'}
                      </p>
                    </div>
                    <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-4">
                      <p className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5"><span>📊</span> Modelo</p>
                      <p className="text-white font-semibold text-sm leading-none">{e.modelo_preco}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-4">
                      <p className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5"><span>🎯</span> Nicho</p>
                      <p className="text-gold font-semibold text-base leading-none">{e.nicho}</p>
                    </div>
                    <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-4">
                      <p className="text-xs text-text-muted mb-1.5 flex items-center gap-1.5"><span>🌍</span> País</p>
                      <p className="text-white font-semibold text-base leading-none">{flag} {e.pais_origen}</p>
                    </div>
                  </div>
                </div>

                {/* Métricas de Escala — premium only */}
                {isPremium && (e.anuncios_ativos ?? 0) > 0 && (() => {
                  const m = calcularMetricas(e.anuncios_ativos, e.data_primeiro_anuncio)
                  if (!m) return null
                  return (
                    <>
                      <div className="h-px bg-white/5 mx-6" />
                      <div className="px-6 py-5">
                        <p className="text-xs text-text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-3">
                          <span>📢</span> Métricas de Escala
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {[
                            { label: 'Anuncios Activos', value: e.anuncios_ativos.toString() },
                            { label: 'Alcance Estimado', value: formatarAlcance(m.alcanceEstimado) },
                            { label: 'Inversión/Día', value: formatarInvestimento(m.investimentoDia) },
                            { label: 'Tiempo en el Mercado', value: m.mesesNoMercado > 0 ? `${m.mesesNoMercado} meses` : `${m.diasNoMercado} días` },
                          ].map(({ label, value }) => (
                            <div key={label} className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-3">
                              <p className="text-[9px] text-text-muted uppercase tracking-[0.1em] mb-1">{label}</p>
                              <p className="text-white font-semibold text-sm leading-none">{value}</p>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] text-text-muted">Score de Escala</span>
                            <span className="text-[10px] text-gold font-semibold">{m.score}/100</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${m.score}%`, background: 'linear-gradient(90deg, rgba(201,168,76,0.7) 0%, rgba(201,168,76,1) 100%)' }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })()}

                {/* Ads section — premium only */}
                {isPremium && ads.length > 0 && (
                  <>
                    <div className="h-px bg-white/5 mx-6" />
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                          <Megaphone size={11} className="text-gold" />
                          Anuncios activos
                        </p>
                        <span className="text-[10px] text-text-muted bg-white/5 border border-white/8 rounded-full px-2 py-0.5">
                          {e.ads_count} encontrados
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}
                      </div>
                      {e.ads_last_sync && (
                        <p className="text-[9px] text-text-muted mt-2.5">
                          Sincronizado {new Date(e.ads_last_sync).toLocaleDateString('es')}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div className="px-6 pb-6 flex flex-col gap-2.5">
                  {e.link_site && (
                    <a
                      href={e.link_site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/12 text-text-secondary hover:text-white hover:border-white/25 text-sm font-medium transition-colors"
                    >
                      <ExternalLink size={14} />
                      Ver sitio web
                    </a>
                  )}
                  {e.link_anuncios && (
                    <a
                      href={e.link_anuncios}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[#0a0a0a] text-sm font-semibold"
                    >
                      <Megaphone size={14} />
                      Ver anuncios en Meta
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </main>
  )
}
