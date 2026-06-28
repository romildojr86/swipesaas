'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Trash2, ExternalLink, Users, Database, TrendingUp } from 'lucide-react'
import { mockSaasEntries } from '@/lib/mock-data'
import type { SaasEntry } from '@/types'

const stats = [
  { label: 'SaaS en catálogo', value: mockSaasEntries.length.toString(), icon: <Database size={16} /> },
  { label: 'Usuarios registrados', value: '—', icon: <Users size={16} /> },
  { label: 'Usuarios premium', value: '—', icon: <TrendingUp size={16} /> },
]

export default function AdminPage() {
  const [entries, setEntries] = useState<SaasEntry[]>(mockSaasEntries)

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-gold-gradient flex items-center justify-center">
                <span className="text-[#0a0a0a] font-bold text-xs font-syne">S</span>
              </div>
              <span className="font-syne font-semibold text-lg text-white">SwipeSaaS</span>
            </Link>
            <span className="text-white/10">/</span>
            <span className="text-gold text-sm font-medium">Admin</span>
          </div>
          <button className="btn-gold flex items-center gap-1.5 px-4 py-2 rounded-md text-[#0a0a0a] text-sm font-semibold">
            <Plus size={14} />
            Nuevo SaaS
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-syne font-semibold text-white text-4xl mb-1">Panel Admin</h1>
          <p className="text-text-secondary text-sm mb-8">Gestión de contenido y usuarios.</p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#111111] border border-white/5 rounded-xl p-5 flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-gold/8 border border-gold/15 flex items-center justify-center text-gold">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-white font-syne font-semibold text-2xl">{stat.value}</p>
                  <p className="text-text-secondary text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-white font-medium text-sm">Entradas del catálogo</h2>
              <span className="text-text-secondary text-xs">{entries.length} entradas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Nombre', 'Nicho', 'Modelo de precio', 'País', 'Acciones'].map((col) => (
                      <th
                        key={col}
                        className="text-left px-6 py-3 text-xs text-text-secondary uppercase tracking-wider font-normal"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => (
                    <tr
                      key={entry.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-md bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0">
                            <span className="text-gold font-syne font-bold text-sm">{entry.nome[0]}</span>
                          </div>
                          <span className="text-white font-medium">{entry.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gold/70 px-2 py-0.5 bg-gold/8 border border-gold/12 rounded-full">
                          {entry.nicho}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">{entry.modelo_preco}</td>
                      <td className="px-6 py-4 text-text-secondary">{entry.pais_origen}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={entry.link_site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-white transition-colors p-1.5"
                          >
                            <ExternalLink size={13} />
                          </a>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-text-secondary hover:text-red-400 transition-colors p-1.5"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
