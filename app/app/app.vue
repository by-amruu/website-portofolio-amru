<template>
  <div class="relative min-h-screen">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
    >
      Lewati ke konten
    </a>

    <ClientOnly><FieldBackground /></ClientOnly>
    <div class="grain" aria-hidden="true" />

    <!-- progres scroll -->
    <div
      class="pointer-events-none fixed inset-x-0 top-0 z-[45] h-[2px] origin-left bg-accent"
      :style="{ transform: `scaleX(${progress})` }"
      aria-hidden="true"
    />

    <!-- NAVBAR: sembunyi saat scroll turun, muncul saat scroll naik -->
    <header
      class="fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-out"
      :class="hidden ? '-translate-y-full' : 'translate-y-0'"
      @focusin="hidden = false"
    >
      <div
        class="border-b transition-[background-color,border-color,backdrop-filter] duration-300"
        :class="scrolled ? 'border-ink/10 bg-paper/75 backdrop-blur-xl' : 'border-transparent'"
      >
        <div class="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <NuxtLink to="/" class="group flex items-center gap-3" aria-label="by.amruu, ke beranda">
            <img
              src="/favicon.png"
              alt=""
              width="28"
              height="28"
              class="h-7 w-7 rounded-full object-cover ring-1 ring-ink/25 transition-transform duration-700 ease-out group-hover:rotate-[360deg]"
            />
            <span class="font-display text-[15px] font-medium tracking-tight">by.amruu</span>
          </NuxtLink>

          <nav class="flex items-center gap-6 sm:gap-8" aria-label="Navigasi utama">
            <template v-if="!isAdmin">
              <a
                v-for="l in links"
                :key="l.id"
                :href="`#${l.id}`"
                class="relative py-2 text-[13px] transition-colors duration-200"
                :class="activeSection === l.id ? 'text-ink' : 'text-ink/65 hover:text-ink'"
                @click.prevent="goTo(l.id)"
              >
                {{ l.label }}
                <span
                  class="absolute inset-x-0 -bottom-px h-px origin-left bg-accent transition-transform duration-500 ease-out"
                  :class="activeSection === l.id ? 'scale-x-100' : 'scale-x-0'"
                />
              </a>
            </template>
            <template v-else>
              <span class="label hidden sm:inline">Konsol admin</span>
              <NuxtLink to="/" class="link-u inline-flex items-center gap-1.5 text-[13px] text-ink/75 hover:text-ink">
                Lihat situs
                <Icon name="arrow-up-right" :size="14" />
              </NuxtLink>
            </template>

            <button
              type="button"
              class="group flex items-center gap-2.5 py-2 text-[13px] text-ink/70 transition-colors hover:text-ink"
              :aria-label="themeLabel"
              :title="themeLabel"
              @click="onCycleTheme"
            >
              <span class="tabular-nums">{{ clock }}</span>
              <span class="hidden text-ink/60 md:inline">{{ phase }}</span>
              <span class="grid h-8 w-8 place-items-center border border-ink/20 transition-colors group-hover:border-ink">
                <Transition name="spin" mode="out-in">
                  <Icon :key="modeIcon" :name="modeIcon" :size="15" />
                </Transition>
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>

    <main id="main" class="relative z-10 min-h-screen">
      <NuxtPage />
    </main>

    <!-- FOOTER -->
    <footer class="relative z-10 border-t border-ink/10">
      <div class="mx-auto max-w-[1440px] px-5 pb-8 pt-10 sm:px-8">
        <div
          v-if="!isAdmin"
          class="reveal select-none overflow-hidden font-display text-[clamp(3.5rem,15.5vw,14rem)] font-medium leading-[0.82] tracking-[-0.05em]"
          data-reveal="fade"
          v-reveal
          aria-hidden="true"
        >
          <span
            v-for="(c, i) in wordmark"
            :key="i"
            class="inline-block transition-[transform,color] duration-500 ease-out hover:-translate-y-3 hover:text-accent"
          >
            {{ c }}
          </span>
        </div>

        <div class="mt-8 flex flex-col gap-4 text-[13px] text-ink/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {{ year }} by.amruu. Dibuat sendiri, dari Kebumen.</p>
          <button type="button" class="link-u inline-flex items-center gap-2 self-start sm:self-auto" @click="toTop">
            Kembali ke atas
            <Icon name="arrow-up" :size="14" />
          </button>
        </div>
      </div>
    </footer>

    <!-- tombol kembali ke atas -->
    <Transition name="up">
      <button
        v-if="showTop"
        type="button"
        class="btn-icon !h-11 !w-11 fixed bottom-5 left-5 z-30 !bg-paper"
        aria-label="Kembali ke atas"
        @click="toTop"
      >
        <Icon name="arrow-up" :size="18" />
      </button>
    </Transition>

    <ClientOnly>
      <CursorLabel />
      <ToastHost />
      <ConfirmHost />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { mode, theme, clock, phase, init, apply, cycle } = useTheme()

const links = [
  { id: 'karya', label: 'Karya' },
  { id: 'cv', label: 'CV & Pengalaman' },
  { id: 'kontak', label: 'Kontak' }
]
const wordmark = 'by.amruu'.split('')
const year = new Date().getFullYear()

const isAdmin = computed(() => route.path.startsWith('/aku-raja'))

useHead({
  meta: [{ name: 'theme-color', content: computed(() => (theme.value === 'light' ? '#f6f5f1' : '#0b0b0c')) }]
})

// --- tema ---
const modeIcon = computed(() => (mode.value === 'auto' ? 'auto' : mode.value === 'light' ? 'sun' : 'moon'))
const themeLabel = computed(() => {
  if (mode.value === 'auto') return `Tema otomatis (sekarang ${theme.value === 'light' ? 'terang' : 'gelap'}). Klik untuk mengganti.`
  return `Tema ${mode.value === 'light' ? 'terang' : 'gelap'} dikunci. Klik untuk mengganti.`
})
watch(theme, apply)

function onCycleTheme() {
  const next = cycle()
  if (next === 'auto') toast.info('Mengikuti waktu: terang 05.30–18.00, gelap setelah magrib.', { title: 'Tema otomatis' })
  else if (next === 'light') toast.info('Tampilan terang dikunci.', { title: 'Tema terang' })
  else toast.info('Tampilan gelap dikunci.', { title: 'Tema gelap' })
}

// --- scroll ---
const progress = ref(0)
const scrolled = ref(false)
const hidden = ref(false)
const showTop = ref(false)
const activeSection = ref('')
let lastY = 0
let ticking = false

function measure() {
  const y = window.scrollY
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(y / max, 1) : 0
  scrolled.value = y > 8
  showTop.value = y > 900

  const delta = y - lastY
  if (y < 120) hidden.value = false
  else if (delta > 8) hidden.value = true
  else if (delta < -8) hidden.value = false
  lastY = y

  if (route.path === '/') {
    let cur = ''
    for (const l of links) {
      const el = document.getElementById(l.id)
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = l.id
    }
    activeSection.value = cur
  } else {
    activeSection.value = ''
  }
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    measure()
  })
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

async function goTo(id: string) {
  if (route.path !== '/') {
    await router.push('/')
    // tunggu transisi halaman selesai sebelum menggulir
    setTimeout(() => scrollToId(id), 700)
    return
  }
  scrollToId(id)
}

function toTop() {
  window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })
}

watch(
  () => route.path,
  () => {
    hidden.value = false
    nextTick(measure)
  }
)

onMounted(() => {
  init()
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>
