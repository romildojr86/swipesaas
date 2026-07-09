'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Pencil, ExternalLink,
  X, AlertTriangle, LogOut, Link as LinkIcon,
  ChevronDown, Upload, ImageIcon, LayoutList, BarChart2, Users, Star,
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import type { SaasEntry, MetaAd } from '@/types'
import AnalyticsDashboard from './AnalyticsDashboard'
import UsersTab, { type AdminProfile } from './UsersTab'

const NICHOS = [
  'Productividad', 'Marketing', 'Finanzas', 'Educación', 'Salud',
  'E-commerce', 'Dev Tools', 'Analytics', 'Formularios', 'Pagamentos',
  'Redes Sociales', 'Otros',
]

const MODELOS = ['Freemium', 'Suscripción', 'One-time', 'Comisión', 'Trial']

const PAISES = [
  { flag: '🇺🇸', name: 'Estados Unidos' },
  { flag: '🇧🇷', name: 'Brasil' },
  { flag: '🇲🇽', name: 'México' },
  { flag: '🇦🇷', name: 'Argentina' },
  { flag: '🇨🇴', name: 'Colombia' },
  { flag: '🇨🇱', name: 'Chile' },
  { flag: '🇵🇪', name: 'Perú' },
  { flag: '🇪🇸', name: 'España' },
  { flag: '🇬🇧', name: 'Reino Unido' },
  { flag: '🇩🇪', name: 'Alemania' },
  { flag: '🇫🇷', name: 'Francia' },
  { flag: '🇨🇦', name: 'Canadá' },
  { flag: '🇦🇺', name: 'Australia' },
  { flag: '🇳🇱', name: 'Países Bajos' },
  { flag: '🇸🇪', name: 'Suecia' },
  { flag: '🇩🇰', name: 'Dinamarca' },
  { flag: '🇫🇮', name: 'Finlandia' },
  { flag: '🇳🇴', name: 'Noruega' },
  { flag: '🇵🇹', name: 'Portugal' },
  { flag: '🇮🇳', name: 'India' },
  { flag: '🇯🇵', name: 'Japón' },
  { flag: '🇰🇷', name: 'Corea del Sur' },
  { flag: '🇧🇬', name: 'Bulgaria' },
  { flag: '🇧🇪', name: 'Bélgica' },
  { flag: '🇪🇪', name: 'Estonia' },
  { flag: '🇺🇾', name: 'Uruguay' },
  { flag: '🇪🇨', name: 'Ecuador' },
  { flag: '🇵🇾', name: 'Paraguay' },
  { flag: '🇧🇴', name: 'Bolivia' },
  { flag: '🇻🇪', name: 'Venezuela' },
  { flag: '🇵🇦', name: 'Panamá' },
  { flag: '🇨🇷', name: 'Costa Rica' },
  { flag: '🇬🇹', name: 'Guatemala' },
  { flag: '🇩🇴', name: 'República Dominicana' },
]

const MONEDAS = [
  { flag: '🇺🇸', code: 'USD', label: 'Dólar' },
  { flag: '🇧🇷', code: 'BRL', label: 'Real' },
  { flag: '🇪🇺', code: 'EUR', label: 'Euro' },
  { flag: '🇲🇽', code: 'MXN', label: 'Peso Mexicano' },
  { flag: '🇦🇷', code: 'ARS', label: 'Peso Argentino' },
  { flag: '🇨🇴', code: 'COP', label: 'Peso Colombiano' },
  { flag: '🇨🇱', code: 'CLP', label: 'Peso Chileno' },
]

const EMPTY_FORM = {
  nome: '',
  nicho: NICHOS[0],
  modelo_preco: MODELOS[0],
  pais_origen: PAISES[0].name,
  cover_url: '',
  mrr: '',
  precio: '',
  moneda: 'USD',
  link_site: '',
  link_anuncios: '',
  anuncios_ativos: '',
  data_primeiro_anuncio: '',
}

type FormData = typeof EMPTY_FORM

interface Props {
  initialEntries: SaasEntry[]
  totalUsers: number
  premiumUsers: number
  profileDates: string[]
  initialProfiles: AdminProfile[]
}

export default function AdminClient({ initialEntries, totalUsers, premiumUsers, profileDates, initialProfiles }: Props) {
  const [entries, setEntries] = useState(initialEntries)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<SaasEntry | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [sizeInfo, setSizeInfo] = useState<{ original: number; compressed: number } | null>(null)
  const [saveError, setSaveError] = useState('')
  const [activeTab, setActiveTab] = useState<'catalogo' | 'analytics' | 'usuarios'>('catalogo')
  const [adsPreview, setAdsPreview] = useState<MetaAd[]>([])
  const [adsSyncing, setAdsSyncing] = useState(false)
  const [adsError, setAdsError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSyncAds = async () => {
    if (!editingEntry || !form.nome) return
    setAdsSyncing(true)
    setAdsError('')
    setAdsPreview([])

    const res = await fetch('/api/meta-ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchTerm: form.nome }),
    })
    const json = await res.json()
    setAdsSyncing(false)

    if (!res.ok) {
      setAdsError(json.error ?? 'Error al sincronizar con Meta')
      return
    }

    const ads: MetaAd[] = json.ads ?? []
    setAdsPreview(ads)

    await supabase.from('saas_entries').update({
      ads_data: ads,
      ads_count: ads.length,
      ads_last_sync: new Date().toISOString(),
    }).eq('id', editingEntry.id)

    setEntries((prev) =>
      prev.map((e) =>
        e.id === editingEntry.id
          ? { ...e, ads_data: ads, ads_count: ads.length, ads_last_sync: new Date().toISOString() }
          : e
      )
    )
  }

  const openAdd = () => {
    setEditingEntry(null)
    setForm(EMPTY_FORM)
    setCoverPreview(null)
    setUploadedUrl(null)
    setSizeInfo(null)
    setSaveError('')
    setAdsPreview([])
    setAdsError('')
    setModalOpen(true)
  }

  const openEdit = (entry: SaasEntry) => {
    setAdsPreview(entry.ads_data ?? [])
    setAdsError('')
    setEditingEntry(entry)
    setForm({
      nome: entry.nome,
      nicho: entry.nicho,
      modelo_preco: entry.modelo_preco,
      pais_origen: entry.pais_origen,
      cover_url: entry.cover_url ?? '',
      mrr: entry.mrr ?? '',
      precio: entry.precio ?? '',
      moneda: entry.moneda || 'USD',
      link_site: entry.link_site ?? '',
      link_anuncios: entry.link_anuncios ?? '',
      anuncios_ativos: (entry.anuncios_ativos ?? 0).toString(),
      data_primeiro_anuncio: entry.data_primeiro_anuncio ?? '',
    })
    const existingCover = entry.cover_url || null
    setCoverPreview(existingCover)
    setUploadedUrl(existingCover)
    setSizeInfo(null)
    setSaveError('')
    setModalOpen(true)
  }

  const compressImage = (file: File): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        const MAX_W = 800
        const scale = img.width > MAX_W ? MAX_W / img.width : 1
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, w, h)
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
          'image/webp',
          0.85
        )
      }
      img.onerror = reject
      img.src = objectUrl
    })

  const handleCoverFile = async (file: File) => {
    setSaveError('')
    setSizeInfo(null)

    if (file.size > 5 * 1024 * 1024) {
      setSaveError('La imagen debe ser menor a 5MB.')
      return
    }

    const COMPRESS_THRESHOLD = 200 * 1024
    const shouldCompress = file.size > COMPRESS_THRESHOLD

    let uploadBlob: Blob = file
    if (shouldCompress) {
      try {
        uploadBlob = await compressImage(file)
        setSizeInfo({ original: file.size, compressed: uploadBlob.size })
      } catch {
        setSaveError('Error al comprimir la imagen.')
        return
      }
    }

    // Show local preview
    const reader = new FileReader()
    reader.onload = (ev) => setCoverPreview(ev.target?.result as string)
    reader.readAsDataURL(uploadBlob)

    setUploading(true)
    const ext = shouldCompress ? 'webp' : (file.name.split('.').pop()?.toLowerCase() ?? 'jpg')
    const path = `${Date.now()}.${ext}`

    const { data, error } = await supabase.storage
      .from('saas-covers')
      .upload(path, uploadBlob, {
        contentType: shouldCompress ? 'image/webp' : file.type,
        cacheControl: '31536000',
        upsert: true,
      })

    if (error) {
      console.error('[cover-upload] storage error:', error)
      setSaveError(`Error al subir imagen: ${error.message}`)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('saas-covers').getPublicUrl(data.path)
    setField('cover_url', urlData.publicUrl)
    setUploadedUrl(urlData.publicUrl)
    setUploading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploading) return
    setSaving(true)
    setSaveError('')

    console.log('[save] form payload:', form)

    const dbPayload = {
      ...form,
      anuncios_ativos: form.anuncios_ativos ? parseInt(form.anuncios_ativos) : 0,
      data_primeiro_anuncio: form.data_primeiro_anuncio || null,
    }

    if (editingEntry) {
      const { data, error } = await supabase
        .from('saas_entries')
        .update(dbPayload)
        .eq('id', editingEntry.id)
        .select()
        .single()

      if (error) {
        console.error('[save] update error:', error)
        setSaveError(error.message)
        setSaving(false)
        return
      }
      console.log('[save] updated entry:', data)
      setEntries((prev) => prev.map((e) => e.id === editingEntry.id ? data as SaasEntry : e))
    } else {
      const { data, error } = await supabase
        .from('saas_entries')
        .insert(dbPayload)
        .select()
        .single()

      if (error) {
        console.error('[save] insert error:', error)
        setSaveError(error.message)
        setSaving(false)
        return
      }
      console.log('[save] inserted entry:', data)
      setEntries((prev) => [data as SaasEntry, ...prev])
    }

    setSaving(false)
    setModalOpen(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    const { error } = await supabase
      .from('saas_entries')
      .delete()
      .eq('id', deleteId)

    if (!error) {
      setEntries((prev) => prev.filter((e) => e.id !== deleteId))
      setDeleteId(null)
    }
    setDeleting(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const toggleFeatured = async (entry: SaasEntry) => {
    if (entry.is_featured) return
    await supabase.from('saas_entries').update({ is_featured: false }).eq('is_featured', true)
    const { error } = await supabase
      .from('saas_entries')
      .update({ is_featured: true })
      .eq('id', entry.id)
    if (!error) {
      setEntries((prev) =>
        prev.map((e) => ({ ...e, is_featured: e.id === entry.id }))
      )
    }
  }

  const setField = (key: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-gold-gradient flex items-center justify-center">
                <span className="text-[#0a0a0a] font-bold text-xs font-syne">S</span>
              </div>
              <span className="font-syne font-semibold text-lg text-white">SwipeSaaS</span>
            </Link>
            <span className="text-white/10">/</span>
            <span className="text-gold text-sm font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'catalogo' && (
              <button
                onClick={openAdd}
                className="btn-gold flex items-center gap-1.5 px-4 py-2 rounded-md text-[#0a0a0a] text-sm font-semibold"
              >
                <Plus size={14} />
                Nuevo SaaS
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-text-secondary hover:text-white transition-colors p-1.5"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="font-syne font-semibold text-white text-4xl mb-1">Panel Admin</h1>
              <p className="text-text-secondary text-sm">Gestión de contenido y usuarios.</p>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex items-center gap-0 border-b border-white/5 mb-6">
            {([
              { key: 'catalogo', label: 'Catálogo', icon: <LayoutList size={14} /> },
              { key: 'analytics', label: 'Analytics', icon: <BarChart2 size={14} /> },
              { key: 'usuarios', label: 'Usuarios', icon: <Users size={14} /> },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200 -mb-px ${
                  activeTab === tab.key
                    ? 'text-white border-gold'
                    : 'text-text-secondary border-transparent hover:text-white/70'
                }`}
              >
                <span className={activeTab === tab.key ? 'text-gold' : 'text-text-muted'}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Catálogo */}
          {activeTab === 'catalogo' && (
            <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-white font-medium text-sm">Entradas del catálogo</h2>
                <span className="text-text-secondary text-xs">{entries.length} entradas</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Nombre', 'Nicho', 'Modelo de precio', 'País', 'Acciones'].map((col) => (
                        <th
                          key={col}
                          className="text-left px-6 py-3 text-xs text-text-secondary uppercase tracking-wider font-normal"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entries.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-text-secondary text-sm">
                          No hay entradas aún. Agrega el primer SaaS.
                        </td>
                      </tr>
                    )}
                    {entries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-[#161616] border border-white/5 shrink-0 overflow-hidden flex items-center justify-center">
                              {entry.cover_url ? (
                                <img src={entry.cover_url} alt={entry.nome} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-lg leading-none">{entry.emoji || entry.nome[0]}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{entry.nome}</span>
                              {entry.is_featured && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-gold bg-gold/10 border border-gold/20 px-1.5 py-0.5 rounded-full">
                                  <Star size={9} className="fill-gold" />
                                  Destacado
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-gold/80 px-2 py-0.5 bg-gold/8 border border-gold/12 rounded-full">
                            {entry.nicho}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-text-secondary">{entry.modelo_preco}</td>
                        <td className="px-6 py-4 text-text-secondary">{entry.pais_origen}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleFeatured(entry)}
                              disabled={entry.is_featured}
                              title={entry.is_featured ? 'SaaS del Día actual' : 'Destacar como SaaS del Día'}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                                entry.is_featured
                                  ? 'text-gold bg-gold/10 border border-gold/20 cursor-default'
                                  : 'text-text-secondary border border-white/8 hover:text-gold hover:border-gold/30 hover:bg-gold/5'
                              }`}
                            >
                              <Star size={10} className={entry.is_featured ? 'fill-gold' : ''} />
                              {entry.is_featured ? 'Destacado' : 'Destacar'}
                            </button>
                            {entry.link_site && (
                              <a
                                href={entry.link_site}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-secondary hover:text-white transition-colors p-1.5 rounded hover:bg-white/5"
                                title="Abrir sitio"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                            <button
                              onClick={() => openEdit(entry)}
                              className="text-text-secondary hover:text-gold transition-colors p-1.5 rounded hover:bg-gold/5"
                              title="Editar"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteId(entry.id)}
                              className="text-text-secondary hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-500/5"
                              title="Eliminar"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Analytics */}
          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              entries={entries}
              totalUsers={totalUsers}
              premiumUsers={premiumUsers}
              profileDates={profileDates}
            />
          )}

          {/* Tab: Usuarios */}
          {activeTab === 'usuarios' && (
            <UsersTab initialProfiles={initialProfiles} />
          )}
        </motion.div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#111111] border border-white/8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <h2 className="font-syne font-semibold text-white text-lg">
                  {editingEntry ? 'Editar SaaS' : 'Agregar SaaS'}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-text-secondary hover:text-white transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="px-6 py-6 space-y-4">
                {saveError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                    {saveError}
                  </div>
                )}

                {/* Nome */}
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                    Nombre del SaaS
                  </label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setField('nome', e.target.value)}
                    required
                    placeholder="ej. Notion AI Writer"
                    className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>

                {/* Imagen de portada */}
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                    Imagen de portada
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverFile(f) }}
                  />
                  <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`relative w-full h-[120px] rounded-lg border-2 border-dashed overflow-hidden transition-colors flex items-center justify-center bg-[#0a0a0a] ${uploading ? 'border-gold/30 cursor-wait' : 'border-white/10 hover:border-gold/30 cursor-pointer'}`}
                  >
                    {coverPreview ? (
                      <>
                        <img src={coverPreview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center gap-1.5 text-white text-xs font-medium bg-black/60 px-3 py-1.5 rounded-full">
                            <Upload size={12} />
                            Cambiar imagen
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-text-secondary pointer-events-none">
                        <ImageIcon size={20} className="text-text-muted" />
                        <span className="text-xs">Haz clic para subir imagen</span>
                        <span className="text-[10px] text-text-muted">JPG, PNG, WebP · Se comprime automáticamente</span>
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  {uploadedUrl && !uploading && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <p className="text-[10px] text-green-400/70">✓ Imagen subida correctamente</p>
                      {sizeInfo && (
                        <span className="text-[10px] text-text-muted bg-white/5 border border-white/8 rounded px-1.5 py-0.5">
                          {(sizeInfo.original / 1024).toFixed(0)} KB → {(sizeInfo.compressed / 1024).toFixed(0)} KB WebP
                          {' '}
                          <span className="text-emerald-400/80">
                            −{Math.round((1 - sizeInfo.compressed / sizeInfo.original) * 100)}%
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* País de origen */}
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                    País de origen
                  </label>
                  <div className="relative">
                    <select
                      value={form.pais_origen}
                      onChange={(e) => setField('pais_origen', e.target.value)}
                      required
                      className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40 appearance-none transition-colors"
                    >
                      {PAISES.map(({ flag, name }) => (
                        <option key={name} value={name}>{flag} {name}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                </div>

                {/* Nicho + Modelo side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                      Nicho
                    </label>
                    <div className="relative">
                      <select
                        value={form.nicho}
                        onChange={(e) => setField('nicho', e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40 appearance-none transition-colors"
                      >
                        {NICHOS.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                      Modelo de precio
                    </label>
                    <div className="relative">
                      <select
                        value={form.modelo_preco}
                        onChange={(e) => setField('modelo_preco', e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40 appearance-none transition-colors"
                      >
                        {MODELOS.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* MRR */}
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                    MRR Estimado
                  </label>
                  <input
                    type="text"
                    value={form.mrr}
                    onChange={(e) => setField('mrr', e.target.value)}
                    placeholder="ej: $42K+"
                    className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>

                {/* Precio + Moneda side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                      Precio
                    </label>
                    <input
                      type="text"
                      value={form.precio}
                      onChange={(e) => setField('precio', e.target.value)}
                      placeholder="ej: 29/mes"
                      className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                      Moneda
                    </label>
                    <div className="relative">
                      <select
                        value={form.moneda}
                        onChange={(e) => setField('moneda', e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40 appearance-none transition-colors"
                      >
                        {MONEDAS.map(({ flag, code, label }) => (
                          <option key={code} value={code}>{flag} {code} — {label}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Link del sitio */}
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                    Link del sitio
                  </label>
                  <div className="relative">
                    <LinkIcon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="url"
                      value={form.link_site}
                      onChange={(e) => setField('link_site', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Link de anuncios */}
                <div>
                  <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                    Link de anuncios
                  </label>
                  <div className="relative">
                    <LinkIcon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="url"
                      value={form.link_anuncios}
                      onChange={(e) => setField('link_anuncios', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Anuncios Activos + Fecha del Primer Anuncio */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                      Anuncios Activos
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.anuncios_ativos}
                      onChange={(e) => setField('anuncios_ativos', e.target.value)}
                      placeholder="ej: 127"
                      className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">
                      Fecha Primer Anuncio
                    </label>
                    <input
                      type="date"
                      value={form.data_primeiro_anuncio}
                      onChange={(e) => setField('data_primeiro_anuncio', e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/8 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold/40 transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Sync Meta Ads — only available when editing an existing entry */}
                {editingEntry && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-text-secondary uppercase tracking-wider">
                        Anuncios Meta
                      </label>
                      {editingEntry.ads_last_sync && (
                        <span className="text-[10px] text-text-muted">
                          Sync: {new Date(editingEntry.ads_last_sync).toLocaleDateString('es')}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleSyncAds}
                      disabled={adsSyncing}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/8 text-text-secondary hover:text-white hover:border-white/20 text-sm transition-colors disabled:opacity-50"
                    >
                      {adsSyncing ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
                          Sincronizando...
                        </>
                      ) : (
                        <>🔄 Sincronizar anuncios</>
                      )}
                    </button>
                    {adsError && (
                      <p className="text-xs text-red-400 mt-1.5">{adsError}</p>
                    )}
                    {adsPreview.length > 0 && (
                      <div className="mt-2 bg-[#0a0a0a] border border-white/5 rounded-lg p-3">
                        <p className="text-[10px] text-green-400/80 mb-2">
                          ✓ {adsPreview.length} anuncios encontrados y guardados
                        </p>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {adsPreview.slice(0, 5).map((ad) => (
                            <a
                              key={ad.id}
                              href={ad.ad_snapshot_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-2 hover:bg-white/3 rounded p-1 transition-colors"
                            >
                              <div className="flex gap-1 shrink-0 mt-0.5">
                                {(ad.publisher_platforms ?? []).slice(0, 2).map((p) => (
                                  <span key={p} className="text-[8px] bg-white/5 border border-white/8 rounded px-1 py-0.5 text-text-muted uppercase">
                                    {p === 'facebook' ? 'FB' : p === 'instagram' ? 'IG' : p.slice(0, 3).toUpperCase()}
                                  </span>
                                ))}
                              </div>
                              <p className="text-[11px] text-text-secondary leading-snug line-clamp-1 flex-1">
                                {ad.ad_creative_body || ad.ad_creative_link_title || 'Ver anuncio →'}
                              </p>
                              <ExternalLink size={10} className="text-text-muted shrink-0 mt-0.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 rounded-lg border border-white/8 text-text-secondary hover:text-white hover:border-white/20 text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 btn-gold py-2.5 rounded-lg text-[#0a0a0a] font-semibold text-sm disabled:opacity-60"
                  >
                    {saving ? 'Guardando...' : uploading ? 'Subiendo imagen...' : editingEntry ? 'Guardar cambios' : 'Agregar SaaS'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation dialog */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#111111] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-syne font-semibold text-base">
                    ¿Eliminar esta entrada?
                  </h3>
                  <p className="text-text-secondary text-xs mt-0.5">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-lg border border-white/8 text-text-secondary hover:text-white hover:border-white/20 text-sm transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
