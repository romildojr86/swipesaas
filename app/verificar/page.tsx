'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'

export default function VerificarPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/verify-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const json = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError('Error al verificar. Intenta de nuevo.')
      return
    }

    if (json.found) {
      router.push(`/cadastro?email=${encodeURIComponent(email.trim().toLowerCase())}`)
    } else {
      setError(
        'No encontramos una compra con este email. Verifica que sea el mismo email usado en Hotmart.'
      )
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-white text-sm transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>

        <div className="bg-[#111111] border border-white/5 rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-7 h-7 rounded-sm bg-gold-gradient flex items-center justify-center">
              <span className="text-[#0a0a0a] font-bold text-xs font-syne">S</span>
            </div>
            <span className="font-syne font-semibold text-lg text-white">SwipeSaaS</span>
          </div>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center mb-6">
            <Search size={20} className="text-gold" />
          </div>

          <h1 className="font-syne font-semibold text-white text-3xl mb-2">
            Verifica tu compra
          </h1>
          <p className="text-text-secondary text-sm mb-8 leading-relaxed">
            Ingresa el email que usaste en tu compra de Hotmart para activar tu acceso.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm mb-6 leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                Email de Hotmart
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="tu@email.com"
                className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-3 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded-lg text-[#0a0a0a] font-semibold text-sm mt-2 disabled:opacity-60"
            >
              {loading ? 'Verificando...' : 'Verificar acceso →'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
