'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Filter, ExternalLink, LogOut } from 'lucide-react'
import { mockSaasEntries, nichos, paises } from '@/lib/mock-data'

export default function CatalogoPage() {
  const [search, setSearch] = useState('')
  const [nichoFilter, setNichoFilter] = useState('Todos')
  const [paisFilter, setPaisFilter] = useState('Todos')

  const filtered = mockSaasEntries.filter((entry) => {
    const matchSearch =
      entry.nome.toLowerCase().includes(search.toLowerCase()) ||
      entry.nicho.toLowerCase().includes(search.toLowerCase())
    const matchNicho = nichoFilter === 'Todos' || entry.nicho === nichoFilter
    const matchPais = paisFilter === 'Todos' || entry.pais_origen === paisFilter
    return matchSearch && matchNicho && matchPais
  })

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-sm bg-gold-gradient flex items-center justify-center">
              <span className="text-[#0a0a0a] font-bold text-xs font-syne">S</span>
            </div>
            <span className="font-syne font-semibold text-lg text-white">SwipeSaaS</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-text-secondary text-sm hidden sm:block">Área de miembros</span>
            <button className="text-text-secondary hover:text-white transition-colors p-1.5">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <h1 className="font-syne font-semibold text-white text-4xl mb-1">Catálogo</h1>
          <p className="text-text-secondary text-sm">
            {filtered.length} SaaS disponibles
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar SaaS o nicho..."
              className="w-full bg-[#111111] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <select
                value={nichoFilter}
                onChange={(e) => setNichoFilter(e.target.value)}
                className="bg-[#111111] border border-white/8 rounded-lg pl-8 pr-8 py-2.5 text-text-secondary text-sm focus:outline-none focus:border-gold/40 appearance-none transition-colors"
              >
                {nichos.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <select
              value={paisFilter}
              onChange={(e) => setPaisFilter(e.target.value)}
              className="bg-[#111111] border border-white/8 rounded-lg px-4 py-2.5 text-text-secondary text-sm focus:outline-none focus:border-gold/40 appearance-none transition-colors"
            >
              {paises.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-text-secondary">
            No se encontraron resultados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-[#111111] border border-white/5 rounded-xl overflow-hidden card-hover"
              >
                {/* Image area */}
                <div className="h-36 bg-gradient-to-br from-[#1a1a1a] to-[#242424] flex items-center justify-center relative">
                  <div className="w-12 h-12 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center">
                    <span className="text-gold font-syne font-bold text-2xl">{entry.nome[0]}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-medium text-sm">{entry.nome}</h3>
                      <p className="text-text-muted text-xs">{entry.pais_origen}</p>
                    </div>
                    <a
                      href={entry.link_site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold/30 hover:text-gold transition-colors"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs text-gold/70 px-2 py-0.5 bg-gold/8 border border-gold/12 rounded-full">
                      {entry.nicho}
                    </span>
                  </div>

                  <p className="text-text-secondary text-xs">{entry.modelo_preco}</p>
                </div>

                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold/40 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
