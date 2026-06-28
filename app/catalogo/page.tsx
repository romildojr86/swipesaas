import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { Database } from '@/types/database'
import type { SaasEntry } from '@/types'
import CatalogoClient from '@/components/catalogo/CatalogoClient'

async function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          )
        },
      },
    }
  )
}

export default async function CatalogoPage() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile to check premium status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium, is_admin, email')
    .eq('id', user.id)
    .single()

  // Fetch saas_entries
  const { data: entries, error } = await supabase
    .from('saas_entries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching saas_entries:', error.message)
  }

  const allEntries = (entries ?? []) as SaasEntry[]

  // Derive filter options from real data
  const nichos = ['Todos', ...Array.from(new Set(allEntries.map((e) => e.nicho)))]
  const paises = ['Todos', ...Array.from(new Set(allEntries.map((e) => e.pais_origen)))]

  const userEmail = (profile as { email?: string } | null)?.email ?? user.email ?? ''

  return (
    <CatalogoClient
      entries={allEntries}
      nichos={nichos}
      paises={paises}
      userEmail={userEmail}
    />
  )
}
