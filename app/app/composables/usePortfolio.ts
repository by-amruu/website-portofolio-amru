import type { PortfolioItem } from '~/utils/portfolio'

/** Memuat daftar karya dari Supabase, dipakai bersama oleh situs publik. */
export function usePortfolio() {
  const supabase = (useNuxtApp() as any).$supabase
  const items = useState<PortfolioItem[]>('portfolio-items', () => [])
  const loading = useState<boolean>('portfolio-loading', () => true)
  const error = useState<string>('portfolio-error', () => '')

  async function load() {
    loading.value = true
    error.value = ''

    if (!supabase) {
      error.value = 'Koneksi database belum dikonfigurasi.'
      loading.value = false
      return
    }

    const { data, error: err } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('order_priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (err) {
      console.warn('[portfolio_items]', err.message)
      error.value = 'Karya belum bisa dimuat.'
    } else {
      items.value = (data ?? []) as PortfolioItem[]
    }
    loading.value = false
  }

  return { items, loading, error, load }
}

