import Link from 'next/link'

const links = {
  Producto: [
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Precios', href: '#precios' },
    { label: 'Funciones', href: '#funciones' },
  ],
  Cuenta: [
    { label: 'Iniciar sesión', href: '/login' },
    { label: 'Registrarse', href: '/cadastro' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-sm bg-gold-gradient flex items-center justify-center">
                <span className="text-[#0a0a0a] font-bold text-xs font-syne">S</span>
              </div>
              <span className="font-syne font-semibold text-lg text-white">SwipeSaaS</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              El swipe file premium de SaaS escalados para emprendedores LATAM.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs text-text-muted uppercase tracking-widest mb-4">{category}</p>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-text-secondary hover:text-white transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} SwipeSaaS. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1 text-text-muted text-xs">
            <span className="w-1 h-1 rounded-full bg-gold/60" />
            <span>Hecho para LATAM</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
