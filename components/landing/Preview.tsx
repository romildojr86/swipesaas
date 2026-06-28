'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Lock, ExternalLink } from 'lucide-react'
import { mockSaasEntries } from '@/lib/mock-data'

const previewEntries = mockSaasEntries.slice(0, 3)
const lockedEntries = mockSaasEntries.slice(3, 6)

const emojiMap: Record<string, string> = {
  'Notion AI Writer': '✍️',
  Lemonsqueezy: '🍋',
  Pocketbase: '🗄️',
  'Tally Forms': '📋',
  Typefully: '🐦',
  Plausible: '📈',
}

const flagMap: Record<string, string> = {
  'Estados Unidos': '🇺🇸',
  Bulgaria: '🇧🇬',
  'Bélgica': '🇧🇪',
  'España': '🇪🇸',
  Estonia: '🇪🇪',
}

// Per-entry colored glow for the emoji area
const glowMap: Record<string, string> = {
  'Notion AI Writer': 'rgba(139,92,246,0.08)',
  Lemonsqueezy: 'rgba(255,200,0,0.08)',
  Pocketbase: 'rgba(59,130,246,0.08)',
  'Tally Forms': 'rgba(16,185,129,0.08)',
  Typefully: 'rgba(14,165,233,0.08)',
  Plausible: 'rgba(201,168,76,0.08)',
}

function CatalogCard({ entry }: { entry: (typeof mockSaasEntries)[0] }) {
  const emoji = emojiMap[entry.nome] ?? entry.nome[0]
  const flag = flagMap[entry.pais_origen] ?? ''
  const glow = glowMap[entry.nome] ?? 'rgba(201,168,76,0.06)'

  return (
    <motion.div
      className="group relative overflow-hidden cursor-default"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: '200px',
        borderRadius: '14px',
        border: '1px solid rgba(201,168,76,0.15)',
        background: '#161616',
      }}
    >
      {/* Hover border brightening via pseudo-overlay trick */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[14px] pointer-events-none z-10 transition-all duration-300 opacity-0 group-hover:opacity-100"
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(201,168,76,0.4)',
        }}
      />

      {/* Top area — floating emoji on dark bg with glow */}
      <div
        className="flex items-center justify-center relative"
        style={{
          height: '120px',
          background: `radial-gradient(ellipse 60% 70% at 50% 60%, ${glow} 0%, #161616 70%)`,
        }}
      >
        <span
          style={{
            fontSize: 48,
            lineHeight: 1,
            display: 'block',
            filter: 'drop-shadow(0 2px 12px rgba(0,0,0,0.4))',
          }}
        >
          {emoji}
        </span>
      </div>

      {/* Bottom area — info bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: '#111111',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Row 1: flag + name + external link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0 pr-2">
            <span style={{ fontSize: 13, lineHeight: 1, flexShrink: 0 }}>{flag}</span>
            <span
              className="text-white font-sans font-semibold text-sm leading-tight truncate"
            >
              {entry.nome}
            </span>
          </div>
          <a
            href={entry.link_site}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 transition-colors duration-200"
            style={{ color: 'rgba(201,168,76,0.3)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.9)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.3)')}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={11} />
          </a>
        </div>

        {/* Row 2: pill badges */}
        <div className="flex gap-1.5 flex-wrap">
          <span
            className="text-[10px] font-sans"
            style={{
              color: 'rgba(201,168,76,0.85)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 100,
              padding: '2px 7px',
              lineHeight: 1.4,
            }}
          >
            {entry.nicho}
          </span>
          <span
            className="text-[10px] font-sans"
            style={{
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 100,
              padding: '2px 7px',
              lineHeight: 1.4,
            }}
          >
            {entry.modelo_preco}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function LockedCard() {
  return (
    <div
      className="locked-card-shimmer relative overflow-hidden"
      style={{
        height: '200px',
        borderRadius: '14px',
        border: '1px solid rgba(201,168,76,0.1)',
        background: `repeating-linear-gradient(
          -45deg,
          #161616 0px,
          #161616 8px,
          #1a1a1a 8px,
          #1a1a1a 16px
        )`,
      }}
    >
      {/* Blurred ghost card structure */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{ filter: 'blur(5px)', opacity: 0.18 }}
      >
        {/* Ghost top */}
        <div
          className="flex items-center justify-center"
          style={{ height: '120px', background: '#161616' }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 12,
            }}
          />
        </div>
        {/* Ghost bottom */}
        <div style={{ height: '80px', background: '#111111', padding: '12px 16px' }}>
          <div
            style={{
              height: 11,
              width: '60%',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <div className="flex gap-1.5">
            <div
              style={{
                height: 16,
                width: 54,
                background: 'rgba(201,168,76,0.2)',
                borderRadius: 100,
              }}
            />
            <div
              style={{
                height: 16,
                width: 62,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 100,
              }}
            />
          </div>
        </div>
      </div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.65) 50%, rgba(10,10,10,0.45) 100%)',
        }}
      />

      {/* Lock content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div
          className="flex items-center justify-center"
          style={{
            width: 40,
            height: 40,
            background: 'rgba(201,168,76,0.07)',
            border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: '50%',
          }}
        >
          <Lock size={16} style={{ color: '#C9A84C' }} />
        </div>
        <p
          className="font-sans text-white/70"
          style={{ fontSize: 11, letterSpacing: '0.05em' }}
        >
          Contenido Premium
        </p>
        <Link
          href="/cadastro"
          className="font-syne font-semibold transition-colors duration-200"
          style={{ fontSize: 11, color: '#C9A84C' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#E2C97E')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#C9A84C')}
        >
          Acceder →
        </Link>
      </div>
    </div>
  )
}

export default function Preview() {
  return (
    <section id="catalogo" className="py-24 md:py-[6rem] px-6">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-gold text-[11px] tracking-[0.15em] uppercase font-sans mb-4">
              Vista previa
            </p>
            <h2
              className="font-syne font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
            >
              Un vistazo al{' '}
              <span className="text-gold-gradient">catálogo.</span>
            </h2>
          </div>
          <Link
            href="/cadastro"
            className="btn-gold self-start md:self-auto flex items-center gap-2 px-6 py-3 rounded-md text-[#0a0a0a] text-sm font-semibold whitespace-nowrap shrink-0"
          >
            Ver todo el catálogo →
          </Link>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {previewEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <CatalogCard entry={entry} />
            </motion.div>
          ))}

          {lockedEntries.map((_, i) => (
            <motion.div
              key={`locked-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 3) * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <LockedCard />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
