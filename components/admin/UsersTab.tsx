'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Crown, AlertTriangle, X } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export interface AdminProfile {
  id: string
  email: string
  is_premium: boolean
  created_at: string
}

interface Props {
  initialProfiles: AdminProfile[]
  premiumPrice?: number
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export default function UsersTab({ initialProfiles, premiumPrice = 19 }: Props) {
  const [profiles, setProfiles] = useState(initialProfiles)
  const [search, setSearch] = useState('')
  const [revokeTarget, setRevokeTarget] = useState<AdminProfile | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const filtered = useMemo(
    () => profiles.filter((p) => p.email.toLowerCase().includes(search.toLowerCase())),
    [profiles, search]
  )

  const premiumCount = profiles.filter((p) => p.is_premium).length
  const revenue = premiumCount * premiumPrice

  const grantPremium = async (profile: AdminProfile) => {
    setToggling(profile.id)
    const { error } = await supabase
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', profile.id)

    if (!error) {
      setProfiles((prev) =>
        prev.map((p) => (p.id === profile.id ? { ...p, is_premium: true } : p))
      )
    }
    setToggling(null)
  }

  const revokePremium = async (profile: AdminProfile) => {
    setToggling(profile.id)

    const res = await fetch('/api/revoke-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: profile.id }),
    })

    if (res.ok) {
      setProfiles((prev) =>
        prev.map((p) => (p.id === profile.id ? { ...p, is_premium: false } : p))
      )
    }
    setToggling(null)
    setRevokeTarget(null)
  }

  return (
    <div>
      {/* Revenue card */}
      <div className="bg-[#111111] border border-white/5 rounded-xl p-6 mb-6 flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0">
          <Crown size={20} className="text-gold" />
        </div>
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-widest mb-1">Ingresos Totales</p>
          <p className="font-syne font-bold text-4xl text-gold">${revenue.toLocaleString('en-US')} USD</p>
          <p className="text-text-secondary text-xs mt-1">
            {premiumCount} usuario{premiumCount !== 1 ? 's' : ''} premium × ${premiumPrice}
          </p>
        </div>
      </div>

      {/* Search + table */}
      <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
        {/* Table header with search */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-medium text-sm">Usuarios registrados</h2>
            <span className="text-text-secondary text-xs">{profiles.length} usuarios</span>
          </div>
          <div className="relative w-56">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg pl-8 pr-3 py-2 text-white text-xs placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Email', 'Estado', 'Fecha de registro', 'Acciones'].map((col) => (
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-secondary text-sm">
                    {search ? 'No se encontraron usuarios.' : 'No hay usuarios registrados aún.'}
                  </td>
                </tr>
              )}
              {filtered.map((profile) => (
                <tr
                  key={profile.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-white font-medium">{profile.email}</td>
                  <td className="px-6 py-4">
                    {profile.is_premium ? (
                      <span className="inline-flex items-center gap-1 text-xs text-gold px-2.5 py-1 bg-gold/8 border border-gold/20 rounded-full font-medium">
                        <Crown size={10} />
                        Premium
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-text-secondary px-2.5 py-1 bg-white/4 border border-white/8 rounded-full">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-xs">
                    {formatDate(profile.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    {profile.is_premium ? (
                      <button
                        onClick={() => setRevokeTarget(profile)}
                        disabled={toggling === profile.id}
                        className="text-xs px-3 py-1.5 rounded-md border border-red-500/30 text-red-400 hover:bg-red-500/8 transition-colors disabled:opacity-40"
                      >
                        Revocar acceso
                      </button>
                    ) : (
                      <button
                        onClick={() => grantPremium(profile)}
                        disabled={toggling === profile.id}
                        className="text-xs px-3 py-1.5 rounded-md border border-gold/30 text-gold hover:bg-gold/8 transition-colors disabled:opacity-40"
                      >
                        {toggling === profile.id ? 'Guardando...' : 'Dar acceso'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revoke confirmation dialog */}
      <AnimatePresence>
        {revokeTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#111111] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle size={18} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-syne font-semibold text-base">
                    ¿Revocar acceso premium?
                  </h3>
                  <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                    ¿Seguro que quieres revocar el acceso de{' '}
                    <span className="text-white font-medium">{revokeTarget.email}</span>?
                    El usuario perderá acceso inmediatamente.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setRevokeTarget(null)}
                  disabled={toggling === revokeTarget.id}
                  className="flex-1 py-2.5 rounded-lg border border-white/8 text-text-secondary hover:text-white hover:border-white/20 text-sm transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => revokePremium(revokeTarget)}
                  disabled={toggling === revokeTarget.id}
                  className="flex-1 py-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {toggling === revokeTarget.id ? 'Revocando...' : 'Sí, revocar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
