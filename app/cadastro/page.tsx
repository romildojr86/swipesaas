'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

function CadastroForm() {
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') ?? ''

  const [nome, setNome] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (!emailFromUrl) {
      router.replace('/verificar')
    }
  }, [emailFromUrl, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email: emailFromUrl,
      password,
      options: { data: { full_name: nome } },
    })

    if (signUpError) {
      setError(
        signUpError.message === 'User already registered'
          ? 'Este correo ya tiene una cuenta. Inicia sesión.'
          : signUpError.message
      )
      setLoading(false)
      return
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: emailFromUrl,
      password,
    })

    if (signInError || !signInData.user) {
      setError('Cuenta creada. Confirma tu correo antes de iniciar sesión.')
      setLoading(false)
      return
    }

    await supabase
      .from('profiles')
      .update({ is_premium: true })
      .eq('id', signInData.user.id)

    router.push('/catalogo')
    router.refresh()
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
          href="/verificar"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-white text-sm transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Volver
        </Link>

        <div className="bg-[#111111] border border-white/5 rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-7 h-7 rounded-sm bg-gold-gradient flex items-center justify-center">
              <span className="text-[#0a0a0a] font-bold text-xs font-syne">S</span>
            </div>
            <span className="font-syne font-semibold text-lg text-white">SwipeSaaS</span>
          </div>

          <h1 className="font-syne font-semibold text-white text-3xl mb-2">
            Crea tu cuenta
          </h1>
          <p className="text-text-secondary text-sm mb-7 leading-relaxed">
            Tu compra fue verificada. Ahora crea tu acceso.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email — locked */}
            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailFromUrl}
                  readOnly
                  className="w-full bg-[#0a0a0a]/50 border border-white/5 rounded-lg px-4 py-3 text-text-secondary text-sm pr-10 cursor-not-allowed"
                />
                <Lock size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              </div>
            </div>

            {/* Nome */}
            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                Nombre
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                autoFocus
                placeholder="Tu nombre"
                className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-3 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>

            {/* Senha */}
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
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-3 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Repite tu contraseña"
                className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-3 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded-lg text-[#0a0a0a] font-semibold text-sm mt-2 disabled:opacity-60"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta →'}
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

export default function CadastroPage() {
  return (
    <Suspense>
      <CadastroForm />
    </Suspense>
  )
}
