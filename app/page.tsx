import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Preview from '@/components/landing/Preview'
import Features from '@/components/landing/Features'
import Pricing from '@/components/landing/Pricing'
import CtaBanner from '@/components/landing/CtaBanner'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Preview />
      <Features />
      <Pricing />
      <CtaBanner />
      <Footer />
    </main>
  )
}
