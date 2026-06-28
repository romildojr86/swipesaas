'use client'

import { motion } from 'framer-motion'
import { DollarSign, Megaphone, Layout, Globe, RefreshCw, BookOpen } from 'lucide-react'

const features = [
  {
    icon: <DollarSign size={24} />,
    title: 'Modelos de precio',
    description:
      'Freemium, suscripción, comisión, seat-based. Descubre qué estructura usa cada SaaS y por qué funciona.',
  },
  {
    icon: <Megaphone size={24} />,
    title: 'Anuncios activos',
    description:
      'Accede a los anuncios que están corriendo ahora mismo. Cópialo y adáptalo para tu producto.',
  },
  {
    icon: <Layout size={24} />,
    title: 'Páginas de captación',
    description:
      'Screenshots y análisis de las landing pages que más convierten. Inspírate en lo que ya funciona.',
  },
  {
    icon: <Globe size={24} />,
    title: '10+ países analizados',
    description:
      'Brasil, México, Argentina, Colombia, Chile y más. Encuentra oportunidades por mercado y nicho.',
  },
  {
    icon: <RefreshCw size={24} />,
    title: 'Actualizaciones semanales',
    description:
      'El catálogo crece cada semana con nuevos SaaS curados por el equipo. Siempre fresco, siempre relevante.',
  },
  {
    icon: <BookOpen size={24} />,
    title: '15 nichos cubiertos',
    description:
      'Fintech, edtech, logística, RRHH, contabilidad y más. Filtra por lo que te interesa y haz zoom.',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Features() {
  return (
    <section id="funciones" className="py-24 md:py-[6rem] px-6">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-xl"
        >
          <p className="text-gold text-[11px] tracking-[0.15em] uppercase font-sans mb-4">
            ¿Qué hay dentro?
          </p>
          <h2
            className="font-syne font-bold text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            Todo lo que necesitas
            <br />
            <span className="text-gold-gradient">para copiar lo que funciona.</span>
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            No más reinventar la rueda. Estudia los mejores SaaS de LATAM y construye
            sobre lo que ya está probado.
          </p>
        </motion.div>

        {/* 2-column grid, no card borders */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="flex gap-5"
            >
              <div className="text-gold shrink-0 mt-0.5">{feature.icon}</div>
              <div>
                <h3 className="text-white font-syne font-bold text-base mb-2">{feature.title}</h3>
                <p className="text-[#a0a0a0] text-[0.875rem] leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
