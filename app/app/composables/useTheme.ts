export type ThemeMode = 'auto' | 'light' | 'dark'

const STORAGE_KEY = 'theme-mode'
const LIGHT_FROM = 5 * 60 + 30 // 05.30
const LIGHT_UNTIL = 18 * 60 // 18.00 (magrib)

let timer: ReturnType<typeof setInterval> | undefined
let animTimer: ReturnType<typeof setTimeout> | undefined

export function phaseOf(minutes: number): string {
  if (minutes < 4 * 60 + 30) return 'Dini hari'
  if (minutes < 5 * 60 + 30) return 'Subuh'
  if (minutes < 11 * 60) return 'Pagi'
  if (minutes < 15 * 60) return 'Siang'
  if (minutes < 18 * 60) return 'Sore'
  if (minutes < 19 * 60) return 'Magrib'
  return 'Malam'
}

/**
 * Tema mengikuti jam perangkat: terang dari 05.30 sampai sebelum 18.00,
 * gelap setelah magrib hingga menjelang pagi. Bisa dikunci manual.
 */
export function useTheme() {
  const mode = useState<ThemeMode>('theme-mode', () => 'auto')
  const now = useState<number>('theme-now', () => Date.now())
  const mounted = useState<boolean>('theme-mounted', () => false)

  const minutes = computed(() => {
    const d = new Date(now.value)
    return d.getHours() * 60 + d.getMinutes()
  })
  const autoTheme = computed<'light' | 'dark'>(() =>
    minutes.value >= LIGHT_FROM && minutes.value < LIGHT_UNTIL ? 'light' : 'dark'
  )
  const theme = computed<'light' | 'dark'>(() => (mode.value === 'auto' ? autoTheme.value : mode.value))

  const pad = (n: number) => String(n).padStart(2, '0')
  const clock = computed(() =>
    mounted.value ? `${pad(Math.floor(minutes.value / 60))}.${pad(minutes.value % 60)}` : '--.--'
  )
  const phase = computed(() => (mounted.value ? phaseOf(minutes.value) : ''))

  function apply() {
    if (!import.meta.client) return
    const el = document.documentElement
    if (el.dataset.theme === theme.value) return
    el.classList.add('theme-anim')
    el.dataset.theme = theme.value
    clearTimeout(animTimer)
    animTimer = setTimeout(() => el.classList.remove('theme-anim'), 750)
  }

  function init() {
    if (!import.meta.client) return
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'light' || saved === 'dark' || saved === 'auto') mode.value = saved
    } catch {
      /* localStorage bisa diblokir; abaikan */
    }
    now.value = Date.now()
    mounted.value = true
    apply()
    if (!timer) timer = setInterval(() => (now.value = Date.now()), 15000)
  }

  /** auto -> terang -> gelap -> auto */
  function cycle(): ThemeMode {
    const order: ThemeMode[] = ['auto', 'light', 'dark']
    mode.value = order[(order.indexOf(mode.value) + 1) % order.length]
    try {
      localStorage.setItem(STORAGE_KEY, mode.value)
    } catch {
      /* abaikan */
    }
    return mode.value
  }

  return { mode, theme, minutes, clock, phase, mounted, init, apply, cycle }
}

