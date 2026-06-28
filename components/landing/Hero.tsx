'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Globe, Zap } from 'lucide-react'

const floatingCards = [
  {
    nome: 'Notion AI Writer',
    emoji: '✍️',
    nicho: 'Productividad',
    pais: 'Estados Unidos',
    flag: '🇺🇸',
    mrr: '$42K+',
    rotate: '-5deg',
    delay: 0,
    glow: 'rgba(120,100,255,0.06)',
    elevation: '0px',
  },
  {
    nome: 'Lemonsqueezy',
    emoji: '🍋',
    nicho: 'Pagamentos',
    pais: 'Estados Unidos',
    flag: '🇺🇸',
    mrr: '$38K+',
    rotate: '-1.5deg',
    delay: 0.1,
    glow: 'rgba(220,190,0,0.06)',
    elevation: '32px',
  },
  {
    nome: 'Pocketbase',
    emoji: '🗄️',
    nicho: 'Dev Tools',
    pais: 'Bulgaria',
    flag: '🇧🇬',
    mrr: '$28K+',
    rotate: '1.5deg',
    delay: 0.2,
    glow: 'rgba(0,180,160,0.06)',
    elevation: '18px',
  },
  {
    nome: 'Typefully',
    emoji: '🐦',
    nicho: 'Redes Sociales',
    pais: 'España',
    flag: '🇪🇸',
    mrr: '$31K+',
    rotate: '4.5deg',
    delay: 0.3,
    glow: 'rgba(0,160,240,0.06)',
    elevation: '0px',
  },
]

const stats = [
  { value: '200+', label: 'SaaS analizados', icon: <TrendingUp size={13} /> },
  { value: '10', label: 'países LATAM', icon: <Globe size={13} /> },
  { value: 'Semanal', label: 'actualizaciones', icon: <Zap size={13} /> },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-28 pb-0 overflow-hidden">
      {/* Radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(201,168,76,0.13) 0%, transparent 70%)',
        }}
      />

      {/* Hero grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-[1100px] w-full mx-auto text-center"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-[11px] text-gold tracking-[0.15em] uppercase font-sans">
            🕵🏻 Espía · Modela · Lanza en LATAM
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-syne font-extrabold leading-[0.95] tracking-tight mb-6"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}
        >
          <span className="block text-white/90">Los SaaS que están</span>
          <span className="block">
            <span
              className="text-gold-gradient-animate font-syne font-extrabold inline-block"
              style={{ fontSize: '1.05em', fontStyle: 'italic', transform: 'skewX(-6deg)' }}
            >
              escalando
            </span>
            <span className="text-white/90"> en el mundo</span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-text-secondary text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-light"
        >
          Estudia el mecanismo, el precio y los anuncios de los SaaS más rentables
          del mundo — modélalos y lanza el tuyo en LATAM.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <Link
            href="/catalogo"
            className="btn-gold flex items-center gap-2 px-7 py-3.5 rounded-md text-[#0a0a0a] text-sm font-semibold"
          >
            Explorar el catálogo
            <ArrowRight size={15} />
          </Link>
          <Link
            href="#precios"
            className="btn-outline flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium"
          >
            Ver planes
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-6 mb-14"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/10 mr-4 hidden sm:block">|</span>}
              <span className="text-gold/50">{stat.icon}</span>
              <span className="text-white font-syne font-semibold text-lg">{stat.value}</span>
              <span className="text-text-secondary text-sm">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Floating cards */}
        <div className="relative flex items-end justify-center gap-3 h-72">
          {/* Fade bottom */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to top, #0a0a0a 10%, transparent 100%)' }}
          />

          {floatingCards.map((card, i) => {
            const isCenter = i === 1

            return (
              <motion.div
                key={card.nome}
                initial={{ opacity: 0, y: 36 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: isCenter ? 1.06 : 1,
                }}
                transition={{ delay: 0.55 + card.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  rotate: card.rotate,
                  width: '220px',
                  background: `radial-gradient(ellipse 120% 100% at 50% 110%, ${card.glow} 0%, #161616 60%)`,
                  border: isCenter
                    ? '1px solid rgba(201,168,76,0.55)'
                    : '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '16px',
                  padding: '18px 20px 16px',
                  boxShadow: isCenter
                    ? '0 0 40px rgba(201,168,76,0.14), 0 8px 32px rgba(0,0,0,0.5)'
                    : '0 4px 20px rgba(0,0,0,0.4)',
                  flexShrink: 0,
                  marginBottom: card.elevation,
                }}
              >
                {/* Top row: logo + nicho badge */}
                <div className="flex items-center justify-between mb-3.5">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 32,
                      height: 32,
                      background: '#222222',
                      borderRadius: 8,
                    }}
                  >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>{card.emoji}</span>
                  </div>
                  <span
                    className="text-[10px] font-sans font-medium tracking-wide"
                    style={{
                      color: '#C9A84C',
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      borderRadius: 100,
                      padding: '2px 8px',
                    }}
                  >
                    {card.nicho}
                  </span>
                </div>

                {/* Name + country */}
                <p className="text-white font-syne font-semibold text-base leading-tight mb-0.5">
                  {card.nome}
                </p>
                <p className="text-[11px] mb-4" style={{ color: '#a0a0a0' }}>
                  {card.flag} {card.pais}
                </p>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 12 }} />

                {/* Bottom: MRR + trend */}
                <div className="flex items-center justify-between">
                  <span className="font-syne font-bold text-sm" style={{ color: '#C9A84C' }}>
                    {card.mrr}
                  </span>
                  <div className="flex items-center gap-1" style={{ color: '#34d399' }}>
                    <TrendingUp size={12} />
                    <span className="text-[10px] font-sans font-medium">+MRR</span>
                  </div>
                </div>

                {/* Gold top line */}
                <div
                  aria-hidden
                  className="absolute top-0 left-0 right-0"
                  style={{
                    height: 1,
                    background: isCenter
                      ? 'linear-gradient(90deg, transparent, rgba(201,168,76,0.7), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)',
                    borderRadius: '16px 16px 0 0',
                  }}
                />
              </motion.div>
            )
          })}

        </div>
      </motion.div>
    </section>
  )
}
