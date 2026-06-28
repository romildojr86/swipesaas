import type { Metadata } from 'next'
import { Syne, Inter } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'SwipeSaaS — El swipe file de los SaaS que escalan en LATAM',
  description:
    'Accede a la base de datos definitiva de SaaS latinoamericanos escalados. Estudia sus estrategias, precios, anuncios y páginas de captación.',
  openGraph: {
    title: 'SwipeSaaS',
    description: 'El catálogo definitivo de SaaS que escalan en LATAM.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${syne.variable} ${inter.variable}`}>
      <body className="grain">{children}</body>
    </html>
  )
}
