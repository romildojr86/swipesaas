export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          is_premium: boolean
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          is_premium?: boolean
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_premium?: boolean
          is_admin?: boolean
          created_at?: string
        }
      }
      saas_entries: {
        Row: {
          id: string
          nome: string
          nicho: string
          modelo_preco: string
          pais_origen: string
          emoji: string
          mrr: string
          precio: string
          print_url: string
          link_site: string
          link_anuncios: string
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          nicho: string
          modelo_preco: string
          pais_origen: string
          emoji?: string
          mrr?: string
          precio?: string
          print_url?: string
          link_site?: string
          link_anuncios?: string
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          nicho?: string
          modelo_preco?: string
          pais_origen?: string
          emoji?: string
          mrr?: string
          precio?: string
          print_url?: string
          link_site?: string
          link_anuncios?: string
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
