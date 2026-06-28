'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

const benefits = [
  'Acceso gratuito a 10 SaaS del catálogo',
  'Filtra por nicho y país',
  'Upgrade a Premium en cualquier momento',
]

export default function CadastroPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setError(
        signUpError.message === 'User already registered'
          ? 'Este correo ya tiene una cuenta. Inicia sesión.'
          : signUpError.message
      )
      setLoading(false)
      return
    }

    // Sign in immediately — works when "Confirm email" is disabled in
    // Supabase Dashboard → Authentication → Providers → Email.
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('Cuenta creada. Confirma tu correo antes de iniciar sesión.')
      setLoading(false)
      return
    }

    router.push('/catalogo')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
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
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-white text-sm transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>

        <div className="bg-[#111111] border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-7 h-7 rounded-sm bg-gold-gradient flex items-center justify-center">
              <span className="text-[#0a0a0a] font-bold text-xs font-syne">S</span>
            </div>
            <span className="font-syne font-semibold text-lg text-white">SwipeSaaS</span>
          </div>

          <h1 className="font-syne font-semibold text-white text-3xl mb-1">
            Crea tu cuenta
          </h1>
          <p className="text-text-secondary text-sm mb-6">
            Empieza gratis. Sin tarjeta de crédito.
          </p>

          <ul className="space-y-2 mb-7">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-text-secondary">
                <Check size={13} className="text-gold shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          <div className="h-px bg-white/5 mb-7" />

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
                minLength={6}
                className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-3 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded-lg text-[#0a0a0a] font-semibold text-sm mt-2 disabled:opacity-60"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
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
