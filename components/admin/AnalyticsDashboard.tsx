'use client'

import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import { BarChart2 } from 'lucide-react'
import type { SaasEntry } from '@/types'

const GOLD = '#C9A84C'
const GOLD_LIGHT = '#E2C97E'
const GOLD_DARK = '#9A7A2E'
const MUTED = '#2a2a2a'

const PALETTE = [
  '#C9A84C', '#E2C97E', '#9A7A2E', '#b8933c', '#dbb96e',
  '#8a6a20', '#f0d898', '#7a5a10', '#a07830',
]

interface Props {
  entries: SaasEntry[]
  totalUsers: number
  premiumUsers: number
  profileDates: string[]
}

function groupBy(arr: string[]): { name: string; total: number }[] {
  const map: Record<string, number> = {}
  for (const v of arr) map[v] = (map[v] ?? 0) + 1
  return Object.entries(map)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
}

function buildGrowthData(dates: string[]): { fecha: string; usuarios: number }[] {
  const today = new Date()
  const days: { fecha: string; usuarios: number }[] = []
  const sorted = dates.map((d) => new Date(d).getTime()).sort((a, b) => a - b)

  for (let i = 29; i >= 0; i--) {
    const day = new Date(today)
    day.setDate(today.getDate() - i)
    day.setHours(0, 0, 0, 0)
    const label = day.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    const cutoff = day.getTime() + 86_400_000
    const count = sorted.filter((t) => t <= cutoff).length
    days.push({ fecha: label, usuarios: count })
  }
  return days
}

const tooltipStyle = {
  backgroundColor: '#111111',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  color: '#fff',
  fontSize: 12,
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-xl p-5">
      <h3 className="text-white font-medium text-sm mb-5">{title}</h3>
      {children}
    </div>
  )
}

export default function AnalyticsDashboard({ entries, totalUsers, premiumUsers, profileDates }: Props) {
  const conversion = totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0

  const nichoData = useMemo(() => groupBy(entries.map((e) => e.nicho)), [entries])
  const paisData = useMemo(
    () => groupBy(entries.map((e) => e.pais_origen)).slice(0, 10),
    [entries]
  )
  const modeloData = useMemo(() => groupBy(entries.map((e) => e.modelo_preco)), [entries])
  const growthData = useMemo(() => buildGrowthData(profileDates), [profileDates])

  const statsCards = [
    { label: 'Total SaaS cadastrados', value: entries.length, suffix: '' },
    { label: 'Usuarios registrados', value: totalUsers, suffix: '' },
    { label: 'Usuarios premium', value: premiumUsers, suffix: '' },
    { label: 'Tasa de conversión', value: conversion, suffix: '%' },
  ]

  return (
    <div className="mt-10">
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gold/8 border border-gold/15 flex items-center justify-center text-gold shrink-0">
          <BarChart2 size={15} />
        </div>
        <div>
          <h2 className="font-syne font-semibold text-white text-xl">Analytics</h2>
          <p className="text-text-secondary text-xs">Métricas y distribución del catálogo</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {statsCards.map((s) => (
          <div
            key={s.label}
            className="bg-[#111111] border border-white/5 rounded-xl px-5 py-4"
          >
            <p className="text-white font-syne font-bold text-3xl">
              {s.value}
              {s.suffix && <span className="text-gold text-lg ml-0.5">{s.suffix}</span>}
            </p>
            <p className="text-text-secondary text-xs mt-1 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* SaaS por Nicho */}
        <ChartCard title="SaaS por Nicho">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={nichoData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#666', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: 'rgba(201,168,76,0.06)' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((v: unknown) => [v, 'SaaS']) as any}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {nichoData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* SaaS por Modelo de Precio (Donut) */}
        <ChartCard title="SaaS por Modelo de Precio">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={modeloData}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  strokeWidth={0}
                  paddingAngle={3}
                >
                  {modeloData.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((v: unknown) => [v, 'SaaS']) as any} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {modeloData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                  />
                  <span className="text-text-secondary text-xs flex-1 truncate">{item.name}</span>
                  <span className="text-white text-xs font-medium">{item.total}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* SaaS por País — full width horizontal bar */}
      <ChartCard title="SaaS por País (Top 10)">
        <ResponsiveContainer width="100%" height={paisData.length * 36 + 10}>
          <BarChart
            layout="vertical"
            data={paisData}
            margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#a0a0a0', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={120}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: 'rgba(201,168,76,0.06)' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((v: unknown) => [v, 'SaaS']) as any}
            />
            <Bar dataKey="total" radius={[0, 4, 4, 0]} fill={GOLD} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Crescimento de Cadastros — line chart */}
      <div className="mt-4">
        <ChartCard title="Crecimiento de Registros (últimos 30 días)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={growthData} margin={{ top: 0, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="fecha"
                tick={{ fill: '#666', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((v: unknown) => [v, 'usuarios acumulados']) as any}
              />
              <Line
                type="monotone"
                dataKey="usuarios"
                stroke={GOLD}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: GOLD_LIGHT, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
