'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // TODO: connect Supabase auth
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      {/* Background glow */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-white text-sm transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>

        {/* Card */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-7 h-7 rounded-sm bg-gold-gradient flex items-center justify-center">
              <span className="text-[#0a0a0a] font-bold text-xs font-syne">S</span>
            </div>
            <span className="font-syne font-semibold text-lg text-white">SwipeSaaS</span>
          </div>

          <h1 className="font-syne font-semibold text-white text-3xl mb-1">
            Bienvenido de nuevo
          </h1>
          <p className="text-text-secondary text-sm mb-8">
            Ingresa a tu cuenta para continuar.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-3 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-3 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded-lg text-[#0a0a0a] font-semibold text-sm mt-2 disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/cadastro" className="text-gold hover:text-gold-light transition-colors">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
