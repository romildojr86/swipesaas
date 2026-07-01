export function calcularMetricas(anunciosAtivos: number, dataPrimeiroAnuncio: string | null) {
  if (!anunciosAtivos || anunciosAtivos === 0) return null

  const alcanceEstimado = anunciosAtivos * 50000
  const investimentoDia = anunciosAtivos * 50

  const diasNoMercado = dataPrimeiroAnuncio
    ? Math.floor((Date.now() - new Date(dataPrimeiroAnuncio).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const mesesNoMercado = Math.floor(diasNoMercado / 30)
  const investimentoTotal = investimentoDia * diasNoMercado
  const score = Math.min(100, Math.floor(anunciosAtivos * 2 + mesesNoMercado * 5))

  return { alcanceEstimado, investimentoDia, investimentoTotal, diasNoMercado, mesesNoMercado, score }
}

export function formatarAlcance(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`
  return n.toString()
}

export function formatarInvestimento(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}
