'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Search, LogOut, Database, Tag, Globe, RefreshCw,
  ExternalLink, Megaphone, ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { SaasEntry } from '@/types'

const flagMap: Record<string, string> = {
  'Estados Unidos': '🇺🇸',
  Bulgaria: '🇧🇬',
  'Bélgica': '🇧🇪',
  'España': '🇪🇸',
  Estonia: '🇪🇪',
  Argentina: '🇦🇷',
  Brasil: '🇧🇷',
  México: '🇲🇽',
  Colombia: '🇨🇴',
  Chile: '🇨🇱',
  'Reino Unido': '🇬🇧',
  Canadá: '🇨🇦',
  Australia: '🇦🇺',
  Alemania: '🇩🇪',
  Francia: '🇫🇷',
  Holanda: '🇳🇱',
  Suecia: '🇸🇪',
}

const nichoGlow: Record<string, string> = {
  Productividad: 'rgba(139,92,246,0.14)',
  Marketing: 'rgba(234,88,12,0.14)',
  Finanzas: 'rgba(16,185,129,0.14)',
  Educación: 'rgba(59,130,246,0.14)',
  Salud: 'rgba(236,72,153,0.14)',
  'E-commerce': 'rgba(245,158,11,0.14)',
  'Dev Tools': 'rgba(99,102,241,0.14)',
  Analytics: 'rgba(20,184,166,0.14)',
  Formularios: 'rgba(168,85,247,0.14)',
  Pagamentos: 'rgba(201,168,76,0.14)',
  'Redes Sociales': 'rgba(14,165,233,0.14)',
  Otros: 'rgba(100,116,139,0.14)',
}

interface Props {
  entries: SaasEntry[]
  nichos: string[]
  paises: string[]
  userEmail: string
}

export default function CatalogoClient({ entries, nichos, paises, userEmail }: Props) {
  const [search, setSearch] = useState('')
  const [nichoFilter, setNichoFilter] = useState('Todos')
  const [paisFilter, setPaisFilter] = useState('Todos')
  const [modeloFilter, setModeloFilter] = useState('Todos')
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const modelos = useMemo(
    () => ['Todos', ...Array.from(new Set(entries.map((e) => e.modelo_preco)))],
    [entries]
  )
  const nichoCount = useMemo(() => new Set(entries.map((e) => e.nicho)).size, [entries])
  const paisCount = useMemo(() => new Set(entries.map((e) => e.pais_origen)).size, [entries])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const filtered = entries.filter((entry) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      entry.nome.toLowerCase().includes(q) ||
      entry.nicho.toLowerCase().includes(q) ||
      entry.pais_origen.toLowerCase().includes(q)
    const matchNicho = nichoFilter === 'Todos' || entry.nicho === nichoFilter
    const matchPais = paisFilter === 'Todos' || entry.pais_origen === paisFilter
    const matchModelo = modeloFilter === 'Todos' || entry.modelo_preco === modeloFilter
    return matchSearch && matchNicho && matchPais && matchModelo
  })

  const statCards = [
    { label: 'Total SaaS', value: entries.length.toString(), icon: <Database size={15} />, isText: false },
    { label: 'Nichos', value: nichoCount.toString(), icon: <Tag size={15} />, isText: false },
    { label: 'Países', value: paisCount.toString(), icon: <Globe size={15} />, isText: false },
    { label: 'Actualizado', value: 'Semanal', icon: <RefreshCw size={15} />, isText: true },
  ]

  const dropdowns = [
    { value: nichoFilter, set: setNichoFilter, options: nichos, placeholder: 'Todos los nichos' },
    { value: paisFilter, set: setPaisFilter, options: paises, placeholder: 'Todos los países' },
    { value: modeloFilter, set: setModeloFilter, options: modelos, placeholder: 'Todos los modelos' },
  ]

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

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7"
        >
          <h1 className="font-syne font-semibold text-white text-4xl mb-1">Catálogo</h1>
          <p className="text-text-secondary text-sm">
            {filtered.length} SaaS disponibles
          </p>
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
          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, nicho o país..."
              className="w-full bg-[#111111] border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
            />
          </div>

          {/* Dropdown row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {dropdowns.map(({ value, set, options, placeholder }) => (
              <div key={placeholder} className="relative">
                <select
                  value={value}
                  onChange={(e) => set(e.target.value)}
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
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-text-secondary text-sm">
            No se encontraron resultados para tu búsqueda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((entry, i) => {
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
                  {/* Top — emoji + glow + badge */}
                  <div
                    className="relative h-[180px] flex items-center justify-center overflow-hidden shrink-0"
                    style={{ background: '#161616' }}
                  >
                    {/* Radial glow behind emoji */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(ellipse 75% 75% at 50% 65%, ${glow} 0%, transparent 70%)`,
                      }}
                    />

                    {/* Status badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-black/50 border border-gold/25 rounded-full px-2.5 py-1 backdrop-blur-sm">
                      <span className="text-[10px] leading-none">🚀</span>
                      <span className="text-[10px] text-gold font-medium tracking-wide leading-none">Escalando</span>
                    </div>

                    {/* Emoji */}
                    <span
                      className="relative z-10 select-none"
                      style={{ fontSize: 56, lineHeight: 1 }}
                    >
                      {emoji}
                    </span>

                    {/* Fade blend into card body */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#111111] to-transparent" />

                    {/* Hover shimmer overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%)' }}
                    />
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-4 gap-3">

                    {/* Name + country */}
                    <div>
                      <h3 className="text-white font-semibold text-[1.05rem] leading-snug truncate mb-0.5">
                        {entry.nome}
                      </h3>
                      <p className="text-text-muted text-xs">
                        {flag} {entry.pais_origen}
                      </p>
                    </div>

                    {/* Metrics */}
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

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-auto pt-0.5">
                      {entry.link_site ? (
                        <a
                          href={entry.link_site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10 text-text-secondary text-[11px] font-medium hover:border-white/25 hover:text-white transition-colors"
                        >
                          <ExternalLink size={11} />
                          Ver sitio
                        </a>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/5 text-text-muted text-[11px] opacity-40 cursor-not-allowed">
                          <ExternalLink size={11} />
                          Ver sitio
                        </span>
                      )}

                      {entry.link_anuncios ? (
                        <a
                          href={entry.link_anuncios}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-gold flex items-center justify-center gap-1.5 py-2 rounded-lg text-[#0a0a0a] text-[11px] font-semibold"
                        >
                          <Megaphone size={11} />
                          Ver anuncios
                        </a>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gold/8 border border-gold/15 text-gold/35 text-[11px] font-semibold cursor-not-allowed">
                          <Megaphone size={11} />
                          Ver anuncios
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
