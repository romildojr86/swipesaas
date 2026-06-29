'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CtaBanner() {
  return (
    <section className="py-24 md:py-[6rem] px-6">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden p-12 md:p-16 text-center"
          style={{
            background: 'linear-gradient(135deg, #111111 0%, #1a1500 100%)',
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 0 80px rgba(201,168,76,0.06), inset 0 0 80px rgba(201,168,76,0.02)',
          }}
        >
          {/* Background glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(201,168,76,0.12) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10">
            <p className="text-gold text-xs tracking-widest uppercase font-sans mb-6">
              ¿Listo para escalar?
            </p>
            <h2
              className="font-syne font-bold text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
            >
              Copia lo que funciona.
              <br />
              <span className="text-gold-gradient">Construye lo que escala.</span>
            </h2>
            <p className="text-text-secondary mb-10 max-w-lg mx-auto">
              Únete a los emprendedores LATAM que usan SwipeSaaS para tomar decisiones
              más inteligentes y lanzar más rápido.
            </p>
            <a
              href="https://pay.hotmart.com/XXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-md text-[#0a0a0a] font-semibold text-base"
            >
              Empezar ahora
              <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
