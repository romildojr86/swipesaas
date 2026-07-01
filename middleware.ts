import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

// Bypasses RLS and Supabase client-side caching for fresh profile reads
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
      global: {
        fetch: (url: RequestInfo | URL, options?: RequestInit) =>
          fetch(url, { ...options, cache: 'no-store' }),
      },
    }
  )
}

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

  // Validates JWT against Supabase auth server (always fresh)
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const isProtected = pathname.startsWith('/catalogo') || pathname.startsWith('/admin')
  const isAuthPage = pathname === '/login' || pathname === '/cadastro'

  if (!user) {
    if (isProtected) return NextResponse.redirect(new URL('/login', request.url))
    return response
  }

  if (isProtected || isAuthPage) {
    // Use service role client with no-store fetch to get live DB value
    const admin = getAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('is_premium, is_admin')
      .eq('id', user.id)
      .single()

    const isPremium = profile?.is_premium ?? false
    const isAdmin = profile?.is_admin ?? false

    if (isProtected) {
      if (pathname.startsWith('/admin') && !isAdmin) {
        return NextResponse.redirect(new URL('/catalogo', request.url))
      }
      if (pathname.startsWith('/catalogo') && !isPremium && !isAdmin) {
        return NextResponse.redirect(new URL('/login?reason=access_revoked', request.url))
      }
    }

    // Only redirect away from login if user actually has access (avoids redirect loop)
    if (isAuthPage && (isPremium || isAdmin)) {
      return NextResponse.redirect(new URL('/catalogo', request.url))
    }
  }

  // Prevent CDN/browser from caching protected page responses
  if (isProtected) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
  }

  return response
}

export const config = {
  matcher: ['/catalogo/:path*', '/admin/:path*', '/login', '/cadastro'],
}
