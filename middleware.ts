import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const isProtected = pathname.startsWith('/catalogo') || pathname.startsWith('/admin')
  const isAuthPage = pathname === '/login' || pathname === '/cadastro'

  // Unauthenticated — block protected routes immediately
  if (!user) {
    if (isProtected) return NextResponse.redirect(new URL('/login', request.url))
    return response
  }

  // Authenticated — fetch profile once for protected routes and auth pages
  if (isProtected || isAuthPage) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium, is_admin')
      .eq('id', user.id)
      .single()

    const isPremium = profile?.is_premium ?? false
    const isAdmin = profile?.is_admin ?? false

    if (isProtected) {
      // /admin requires is_admin
      if (pathname.startsWith('/admin') && !isAdmin) {
        return NextResponse.redirect(new URL('/catalogo', request.url))
      }
      // /catalogo requires is_premium or is_admin
      if (pathname.startsWith('/catalogo') && !isPremium && !isAdmin) {
        return NextResponse.redirect(new URL('/login?reason=access_revoked', request.url))
      }
    }

    // Redirect away from login/cadastro only if user actually has access
    // (avoids loop: revoked user → /login → /catalogo → /login…)
    if (isAuthPage && (isPremium || isAdmin)) {
      return NextResponse.redirect(new URL('/catalogo', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/catalogo/:path*', '/admin/:path*', '/login', '/cadastro'],
}
