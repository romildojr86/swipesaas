export interface MetaAd {
  id: string
  ad_creative_body?: string
  ad_creative_link_title?: string
  ad_snapshot_url: string
  ad_delivery_start_time?: string
  ad_delivery_stop_time?: string
  publisher_platforms?: string[]
  impressions?: { lower_bound: string; upper_bound: string }
  spend?: { lower_bound: string; upper_bound: string }
}

export interface SaasEntry {
  id: string
  nome: string
  nicho: string
  modelo_preco: string
  pais_origen: string
  emoji: string
  mrr: string
  precio: string
  moneda: string
  cover_url: string
  print_url: string
  link_site: string
  link_anuncios: string
  is_featured: boolean
  ads_data: MetaAd[] | null
  ads_count: number
  ads_last_sync: string | null
  created_at: string
}

export interface Profile {
  id: string
  email: string
  is_premium: boolean
  is_admin: boolean
  created_at: string
}
