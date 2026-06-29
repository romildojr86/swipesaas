'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'

const features = [
  'Acceso completo a 200+ SaaS',
  'Modelos de precio detallados',
  'Anuncios activos de cada empresa',
  'Screenshots de páginas de captación',
  'Filtros por nicho, país y modelo',
  'Actualizaciones semanales',
  'Acceso de por vida a los archivos',
  'Soporte prioritario',
]

export default function Pricing() {
  return (
    <section id="precios" className="py-24 md:py-[6rem] px-6">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p className="text-gold text-[11px] tracking-[0.15em] uppercase font-sans mb-4">Planes</p>
          <h2
            className="font-syne font-bold text-white leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            Un solo plan. Sin sorpresas.
          </h2>
        </motion.div>

        {/* Single premium card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[420px] rounded-2xl p-8 bg-[#111111]"
          style={{
            border: '1px solid rgba(201, 168, 76, 0.2)',
            boxShadow: '0 0 40px rgba(201, 168, 76, 0.15)',
          }}
        >
          {/* Plan label */}
          <p className="text-[11px] text-gold/70 tracking-[0.15em] uppercase font-sans mb-6">
            Acceso Premium
          </p>

          {/* Price */}
          <div className="mb-1">
            <span
              className="font-syne font-bold text-white"
              style={{ fontSize: '3rem', lineHeight: 1 }}
            >
              $27 USD
            </span>
          </div>
          <p className="text-gold text-sm font-sans mb-7">pago único</p>

          {/* Divider */}
          <div className="h-px bg-gold/10 mb-7" />

          {/* Checklist */}
          <ul className="space-y-3.5 mb-8">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <Check size={15} className="text-gold shrink-0 mt-0.5" />
                <span className="text-white/80 leading-snug">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="https://pay.hotmart.com/S106537389G?checkoutMode=10"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold block text-center py-4 rounded-md text-[#0a0a0a] font-semibold text-sm"
          >
            Acceder ahora →
          </a>

          <p className="text-center text-text-muted text-xs mt-4">
            Pago único · Acceso de por vida
          </p>
        </motion.div>
      </div>
    </section>
  )
}
