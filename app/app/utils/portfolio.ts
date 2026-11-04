export interface PortfolioItem {
  id: string
  created_at: string
  title: string
  description: string | null
  platform: string
  category: string | null
  preview_url: string
  live_url: string | null
  github_url?: string | null
  aspect_ratio: string | null
  tech_stack: string[] | null
  order_priority: number | null
}

export const PLATFORMS = [
  { key: 'website', label: 'Website' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'pinterest', label: 'Pinterest' }
] as const

export const RATIOS = [
  { key: '3:4', label: '3:4', hint: 'Feed foto' },
  { key: '9:16', label: '9:16', hint: 'Vertikal' },
  { key: '16:9', label: '16:9', hint: 'Lanskap' }
] as const

export function platformLabel(key?: string | null): string {
  return PLATFORMS.find((p) => p.key === key)?.label ?? (key ? key[0].toUpperCase() + key.slice(1) : 'Karya')
}

export function aspectClass(ratio?: string | null): string {
  if (ratio === '16:9') return 'aspect-[16/9]'
  if (ratio === '9:16') return 'aspect-[9/16]'
  return 'aspect-[3/4]'
}

export function formatMonth(iso?: string | null): string {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(d)
}

/** Tambahkan https:// bila pengguna lupa menulis skema. */
export function normalizeUrl(value: string): string {
  const v = value.trim()
  if (!v) return ''
  return /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`
}

export function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

/** Hanya izinkan http(s) untuk href yang berasal dari database. */
export function safeUrl(value?: string | null): string {
  return value && isHttpUrl(value) ? value : ''
}

/**
 * Optimasi CDN Gambar Supabase:
 * Mengubah URL bucket Supabase asli menjadi URL transform (WebP, resized, quality 80)
 * sehingga ukuran file turun dari beberapa MB menjadi ~50-100 KB.
 * Jika bukan URL Supabase (mis. gambar external), kembalikan URL aslinya.
 */
export function getOptimizedImageUrl(
  url?: string | null,
  options: { width?: number; quality?: number; format?: 'webp' | 'avif' | 'origin' } = {}
): string {
  if (!url) return ''
  const { width = 720, quality = 80, format = 'webp' } = options

  // Pola Supabase Storage URL: /storage/v1/object/public/...
  if (url.includes('/storage/v1/object/public/')) {
    const transformed = url.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    )
    const joiner = transformed.includes('?') ? '&' : '?'
    return `${transformed}${joiner}width=${width}&quality=${quality}&format=${format}`
  }

  return url
}

