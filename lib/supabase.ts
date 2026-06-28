import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client — for use in Client Components
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Browser client via SSR package (preferred in Client Components)
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Server client — for use in Server Components, Route Handlers, Server Actions
// Requires cookies to be passed from the request context
export function createServerSupabaseClient(cookieStore: {
  get: (name: string) => { value: string } | undefined
}) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return Object.keys(cookieStore).map((name) => ({
          name,
          value: (cookieStore.get(name) as { value: string } | undefined)?.value ?? '',
        }))
      },
      setAll() {},
    },
  })
}

// Admin client — server-only, bypasses RLS (never expose to client)
export function createAdminSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
