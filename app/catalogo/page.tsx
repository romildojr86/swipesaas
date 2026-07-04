import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { Database } from '@/types/database'
import type { SaasEntry } from '@/types'
import CatalogoClient from '@/components/catalogo/CatalogoClient'

const PAGE_SIZE = 20

async function getSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          )
        },
      },
    }
  )
}

interface SearchParams {
  page?: string
  nicho?: string
  pais?: string
  modelo?: string
  q?: string
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium, is_admin, email')
    .eq('id', user.id)
    .single()

  const profileData = profile as { email?: string; is_premium?: boolean; is_admin?: boolean } | null
  const userEmail = profileData?.email ?? user.email ?? ''
  const isPremium = profileData?.is_premium || profileData?.is_admin || false

  // Parse pagination + filters from URL
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const nichoFilter = searchParams.nicho && searchParams.nicho !== 'Todos' ? searchParams.nicho : null
  const paisFilter = searchParams.pais && searchParams.pais !== 'Todos' ? searchParams.pais : null
  const modeloFilter = searchParams.modelo && searchParams.modelo !== 'Todos' ? searchParams.modelo : null
  const searchQuery = searchParams.q?.trim() ?? ''

  // Filtered + paginated entries
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('saas_entries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (nichoFilter) query = query.eq('nicho', nichoFilter)
  if (paisFilter) query = query.eq('pais_origen', paisFilter)
  if (modeloFilter) query = query.eq('modelo_preco', modeloFilter)
  if (searchQuery) query = query.ilike('nome', `%${searchQuery}%`)

  const { data: entries, count, error } = await query.range(from, to)

  if (error) console.error('[catalogo] fetch error:', error.message)

  // Lightweight query for filter option lists (all rows, 3 columns only)
  const { data: allMeta } = await supabase
    .from('saas_entries')
    .select('nicho, pais_origen, modelo_preco')

  const nichos = ['Todos', ...Array.from(new Set((allMeta ?? []).map((e: { nicho: string }) => e.nicho)))]
  const paises = ['Todos', ...Array.from(new Set((allMeta ?? []).map((e: { pais_origen: string }) => e.pais_origen)))]
  const modelos = ['Todos', ...Array.from(new Set((allMeta ?? []).map((e: { modelo_preco: string }) => e.modelo_preco)))]

  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  // Most recent entry date for the stat card
  const { data: latestRow } = await supabase
    .from('saas_entries')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle() as { data: { created_at: string } | null }

  const lastUpdated = latestRow?.created_at
    ? new Date(latestRow.created_at).toLocaleDateString('es', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

  return (
    <CatalogoClient
      entries={(entries ?? []) as SaasEntry[]}
      nichos={nichos}
      paises={paises}
      modelos={modelos}
      userEmail={userEmail}
      isPremium={isPremium}
      page={page}
      totalPages={totalPages}
      totalCount={totalCount}
      pageSize={PAGE_SIZE}
      lastUpdated={lastUpdated}
      currentFilters={{
        nicho: searchParams.nicho ?? 'Todos',
        pais: searchParams.pais ?? 'Todos',
        modelo: searchParams.modelo ?? 'Todos',
        q: searchParams.q ?? '',
      }}
    />
  )
}
