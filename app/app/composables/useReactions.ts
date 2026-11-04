export const REACTIONS = [
  { key: 'suka', label: 'Suka', icon: 'heart' },
  { key: 'keren', label: 'Keren', icon: 'spark' },
  { key: 'rapi', label: 'Rapi', icon: 'check' }
] as const

export type ReactionKey = (typeof REACTIONS)[number]['key']
type Counts = Record<string, Partial<Record<ReactionKey, number>>>

const LS_VISITOR = 'visitor-id'
const LS_MINE = 'reactions-mine'

function visitorId(): string {
  let id = localStorage.getItem(LS_VISITOR)
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `v${Date.now()}${Math.random().toString(36).slice(2)}`
    localStorage.setItem(LS_VISITOR, id)
  }
  return id
}

/**
 * Reaksi anonim per karya. Jumlah disimpan di Supabase (lihat
 * docs/REACTIONS_SETUP.sql); pilihan pengunjung diingat di localStorage.
 * Jika tabel belum dibuat, reaksi tetap berfungsi secara lokal.
 */
export function useReactions() {
  const supabase = (useNuxtApp() as any).$supabase
  const counts = useState<Counts>('rx-counts', () => ({}))
  const mine = useState<Record<string, ReactionKey[]>>('rx-mine', () => ({}))
  const remote = useState<boolean>('rx-remote', () => true)
  const loaded = useState<boolean>('rx-loaded', () => false)

  async function load(force = false) {
    if (!import.meta.client) return
    try {
      mine.value = JSON.parse(localStorage.getItem(LS_MINE) || '{}')
    } catch {
      mine.value = {}
    }
    if (loaded.value && !force) return
    loaded.value = true

    if (!supabase) {
      remote.value = false
      return
    }
    const { data, error } = await supabase.from('portfolio_reaction_counts').select('item_id,reaction,total')
    if (error) {
      remote.value = false
      console.warn('[reaksi] belum aktif di database:', error.message)
      return
    }
    const next: Counts = {}
    for (const row of data ?? []) {
      const bucket = (next[row.item_id] ||= {})
      bucket[row.reaction as ReactionKey] = row.total
    }
    counts.value = next
  }

  const countOf = (id: string, key: ReactionKey) => counts.value[id]?.[key] ?? 0
  const totalOf = (id: string) => REACTIONS.reduce((sum, r) => sum + countOf(id, r.key), 0)
  const grandTotal = computed(() => Object.keys(counts.value).reduce((sum, id) => sum + totalOf(id), 0))
  const hasMine = (id: string, key: ReactionKey) => !!mine.value[id]?.includes(key)

  function applyLocal(id: string, key: ReactionKey, on: boolean) {
    const set = new Set(mine.value[id] ?? [])
    if (on) set.add(key)
    else set.delete(key)
    mine.value = { ...mine.value, [id]: [...set] }
    counts.value = {
      ...counts.value,
      [id]: { ...counts.value[id], [key]: Math.max(0, countOf(id, key) + (on ? 1 : -1)) }
    }
    try {
      localStorage.setItem(LS_MINE, JSON.stringify(mine.value))
    } catch {
      /* abaikan */
    }
  }

  async function toggle(id: string, key: ReactionKey): Promise<{ ok: boolean; on: boolean; message?: string }> {
    const on = !hasMine(id, key)
    applyLocal(id, key, on)
    if (!remote.value || !supabase) return { ok: true, on }

    const vid = visitorId()
    const query = on
      ? supabase.from('portfolio_reactions').insert({ item_id: id, reaction: key, visitor_id: vid })
      : supabase.from('portfolio_reactions').delete().eq('item_id', id).eq('reaction', key).eq('visitor_id', vid)
    const { error } = await query

    // 23505 = sudah pernah tercatat; anggap berhasil
    if (error && error.code !== '23505') {
      applyLocal(id, key, !on)
      return { ok: false, on: !on, message: error.message }
    }
    return { ok: true, on }
  }

  return { counts, mine, remote, load, countOf, totalOf, grandTotal, hasMine, toggle }
}

