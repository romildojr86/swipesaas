export interface SaasEntry {
  id: string
  nome: string
  nicho: string
  modelo_preco: string
  pais_origen: string
  emoji: string
  mrr: string
  print_url: string
  link_site: string
  link_anuncios: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  is_premium: boolean
  is_admin: boolean
  created_at: string
}
