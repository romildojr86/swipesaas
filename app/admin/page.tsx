import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { Database } from '@/types/database'
import type { SaasEntry } from '@/types'
import AdminClient from '@/components/admin/AdminClient'

async function getSupabaseServerClient() {
  const cookieStore = await cookies()
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

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, email')
    .eq('id', user.id)
    .single()

  if (!(profile as { is_admin?: boolean } | null)?.is_admin) redirect('/catalogo')

  const { data: entries } = await supabase
    .from('saas_entries')
    .select('*')
    .order('created_at', { ascending: false })

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: premiumUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_premium', true)

  const { data: profileRows } = await supabase
    .from('profiles')
    .select('created_at')
    .order('created_at', { ascending: true })

  const profileDates = (profileRows ?? []).map((r) => (r as { created_at: string }).created_at)

  return (
    <AdminClient
      initialEntries={(entries ?? []) as SaasEntry[]}
      totalUsers={totalUsers ?? 0}
      premiumUsers={premiumUsers ?? 0}
      profileDates={profileDates}
    />
  )
}
