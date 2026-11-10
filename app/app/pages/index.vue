<template>
  <div>
    <!-- ================= HERO ================= -->
    <section class="mx-auto max-w-[1440px] px-5 pb-20 pt-32 sm:px-8 md:pb-28 md:pt-44">
      <div class="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div class="lg:col-span-8">
          <p class="label reveal flex items-center gap-3" data-reveal="fade" v-reveal>
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Terbuka untuk project &amp; kolaborasi
          </p>

          <h1
            class="mt-8 font-display font-medium leading-[0.84] tracking-[-0.05em] text-[clamp(5.5rem,19vw,16rem)]"
            aria-label="Amru"
          >
            <span class="mask-line"><span style="--d: 60ms">Amru<span class="text-accent">.</span></span></span>
          </h1>

          <div class="mt-8 font-display text-[clamp(1.6rem,3.6vw,3rem)] leading-[1.08] tracking-tight">
            <span class="mask-line"><span style="--d: 260ms">Desainer grafis &amp; pembuat web</span></span>
            <span class="mask-line"><span class="text-ink/45" style="--d: 360ms">dari Kebumen, Jawa Tengah.</span></span>
          </div>

          <p class="reveal mt-8 max-w-xl text-[15px] leading-relaxed text-ink/70" v-reveal="450">
            Kumpulan karya yang saya buat sendiri: desain kemasan, konten edukasi grafis, poster, dan eksperimen web.
            Klik karya mana pun untuk melihatnya lebih dekat.
          </p>

          <div class="reveal mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" v-reveal="560">
            <button type="button" class="btn-ink" @click="scrollTo('karya')">
              <span>Lihat karya</span>
              <Icon name="arrow-down" :size="16" />
            </button>
            <button type="button" class="btn-line" @click="scrollTo('cv')">
              <span>Lihat CV &amp; Pengalaman</span>
            </button>
            <button type="button" class="link-u inline-flex items-center gap-2 text-sm" @click="scrollTo('kontak')">
              Hubungi saya
              <Icon name="arrow-up-right" :size="14" />
            </button>
          </div>
        </div>

        <aside class="reveal space-y-10 lg:col-span-4 lg:pt-10" v-reveal="300">
          <SunPath />

          <dl class="divide-y divide-ink/10 border-y border-ink/10">
            <div v-for="s in stats" :key="s.label" class="flex items-baseline justify-between py-3.5">
              <dt class="text-sm text-ink/70">{{ s.label }}</dt>
              <dd class="font-display text-3xl tracking-tight"><CountUp :value="s.value" /></dd>
            </div>
            <div v-if="!stats.length" class="py-3.5 text-sm text-ink/60">Menghitung karya…</div>
          </dl>
        </aside>
      </div>
    </section>

    <!-- ================= PITA BERJALAN ================= -->
    <div class="marquee-wrap overflow-hidden border-y border-ink/10 py-5 sm:py-7" aria-hidden="true">
      <div class="marquee" style="--dur: 55s">
        <div v-for="n in 2" :key="n" class="flex shrink-0 items-center">
          <template v-for="w in ticker" :key="w">
            <span class="whitespace-nowrap px-6 font-display text-3xl font-medium tracking-tight sm:px-10 sm:text-5xl">
              {{ w }}
            </span>
            <span class="h-2 w-2 shrink-0 rotate-45 bg-accent" />
          </template>
        </div>
      </div>
    </div>

    <!-- ================= KARYA ================= -->
    <section id="karya" class="mx-auto max-w-[1440px] scroll-mt-20 px-5 py-24 sm:px-8 md:py-32">
      <header class="mb-12 flex flex-col gap-10 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div class="reveal" v-reveal>
          <p class="label">01 — Arsip karya</p>
          <h2 class="mt-4 font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.95] tracking-[-0.04em]">
            Karya <span class="text-ink/40">terpilih</span>
          </h2>
        </div>

        <div class="reveal max-w-full overflow-x-auto" v-reveal="120">
          <div ref="tabsEl" class="relative flex min-w-max gap-8 border-b border-ink/15" role="tablist" aria-label="Filter platform">
            <button
              v-for="t in tabs"
              :key="t.key"
              :ref="(el) => setTabEl(t.key, el as HTMLElement | null)"
              type="button"
              role="tab"
              :aria-selected="active === t.key"
              class="relative pb-3.5 text-sm transition-colors duration-200"
              :class="active === t.key ? 'text-ink' : 'text-ink/60 hover:text-ink'"
              @click="setFilter(t.key)"
            >
              {{ t.label }}
              <sup class="ml-1 text-[10px] tabular-nums">{{ t.count }}</sup>
            </button>
            <span
              class="absolute -bottom-px left-0 h-[2px] bg-accent ease-out"
              :class="ind.ready ? 'transition-[transform,width] duration-500' : ''"
              :style="{ width: ind.w + 'px', transform: `translateX(${ind.x}px)` }"
              aria-hidden="true"
            />
          </div>
        </div>
      </header>

      <!-- memuat -->
      <div v-if="loading" class="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true">
        <div v-for="n in 8" :key="n">
          <div class="skeleton" :class="n % 4 === 2 ? 'aspect-[16/9] sm:col-span-2' : 'aspect-[3/4]'" />
          <div class="skeleton mt-4 h-3 w-1/3" />
          <div class="skeleton mt-3 h-5 w-2/3" />
        </div>
      </div>

      <!-- gagal -->
      <div v-else-if="error" class="border border-dashed border-ink/25 px-6 py-16 text-center" role="alert">
        <p class="font-display text-2xl">{{ error }}</p>
        <p class="mt-2 text-sm text-ink/65">Periksa koneksi internet, lalu coba lagi.</p>
        <button type="button" class="btn-ink mt-6" @click="reload"><span>Coba lagi</span></button>
      </div>

      <!-- kosong -->
      <div v-else-if="!filtered.length" class="border border-dashed border-ink/25 px-6 py-16 text-center">
        <p class="font-display text-2xl">Belum ada karya di sini.</p>
        <p class="mt-2 text-sm text-ink/65">Kategori ini akan segera diisi.</p>
      </div>

      <!-- grid -->
      <TransitionGroup
        v-else
        name="work"
        tag="div"
        class="grid grid-flow-dense grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <WorkCard
          v-for="(it, i) in visible"
          :key="it.id"
          :item="it"
          :index="i"
          :delay="(i % 4) * 90"
          @open="openId = $event"
        />
      </TransitionGroup>

      <div v-if="remaining > 0" class="mt-20 flex justify-center">
        <button type="button" class="group flex flex-col items-center gap-3" @click="more">
          <span class="link-u font-display text-2xl tracking-tight">Tampilkan {{ Math.min(PAGE, remaining) }} karya lagi</span>
          <span class="label inline-flex items-center gap-2">
            {{ remaining }} tersisa
            <Icon name="arrow-down" :size="12" class="transition-transform duration-300 group-hover:translate-y-1" />
          </span>
        </button>
      </div>
    </section>

    <!-- ================= CV & PENGALAMAN ================= -->
    <CvSection :settings="cvSettings" :entries="cvEntries" />

    <!-- ================= KONTAK ================= -->
    <section id="kontak" class="scroll-mt-20 border-t border-ink/10">
      <div class="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-36">
        <p class="label reveal" v-reveal>02 — Kontak</p>
        <h2
          class="reveal mt-6 font-display text-[clamp(2.8rem,9vw,8rem)] leading-[0.94] tracking-[-0.045em]"
          v-reveal="100"
        >
          Punya ide?<br /><span class="text-ink/40">Ayo ngobrol.</span>
        </h2>

        <div class="mt-16 grid gap-12 lg:grid-cols-12">
          <div class="reveal lg:col-span-6" v-reveal="200">
            <p class="max-w-md text-[15px] leading-relaxed text-ink/70">
              Butuh desain kemasan, aset konten, atau website sederhana? Kirim pesan singkat berisi kebutuhan dan
              tenggat waktunya, nanti saya balas.
            </p>
            <div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a :href="primary.href" target="_blank" rel="noopener noreferrer" class="btn-ink">
                <span>{{ primary.label }}</span>
                <Icon name="arrow-up-right" :size="16" />
              </a>
              <button v-if="email" type="button" class="link-u inline-flex items-center gap-2 text-sm" @click="copyEmail">
                <Icon name="link" :size="15" />
                Salin email
              </button>
            </div>
          </div>

          <ul class="reveal lg:col-span-6" v-reveal="300">
            <li v-for="s in socials" :key="s.name" class="border-t border-ink/15 last:border-b">
              <a
                :href="s.href"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center justify-between px-0 py-5 transition-[padding,background-color,color] duration-300 ease-out hover:bg-ink hover:px-5 hover:text-paper focus-visible:bg-ink focus-visible:px-5 focus-visible:text-paper"
              >
                <span class="font-display text-2xl tracking-tight">{{ s.name }}</span>
                <span class="flex items-center gap-3 text-sm opacity-70">
                  {{ s.handle }}
                  <Icon
                    name="arrow-up-right"
                    :size="16"
                    class="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <WorkModal v-model="openId" :items="filtered" />
  </div>
</template>

<script setup lang="ts">
import type { CvSettings, CvEntry } from '~/utils/portfolio'

const PAGE = 12

const supabase = (useNuxtApp() as any).$supabase
const config = useRuntimeConfig()
const toast = useToast()
const { items, loading, error, load } = usePortfolio()
const rx = useReactions()

const cvSettings = ref<CvSettings | null>(null)
const cvEntries = ref<CvEntry[]>([])

async function loadCvData() {
  if (!supabase) return
  const [sRes, eRes] = await Promise.all([
    supabase.from('cv_settings').select('*').eq('id', 'default').maybeSingle(),
    supabase.from('cv_entries').select('*').order('order_priority', { ascending: false }).order('created_at', { ascending: false })
  ])
  if (sRes.data) cvSettings.value = sRes.data as CvSettings
  if (eRes.data) cvEntries.value = eRes.data as CvEntry[]
}

const active = ref('all')
const limit = ref(PAGE)
const openId = ref<string | null>(null)

const present = computed(() => PLATFORMS.filter((p) => items.value.some((i) => i.platform === p.key)))

const tabs = computed(() => [
  { key: 'all', label: 'Semua', count: items.value.length },
  ...present.value.map((p) => ({
    key: p.key as string,
    label: p.label as string,
    count: items.value.filter((i) => i.platform === p.key).length
  }))
])

const stats = computed(() =>
  items.value.length
    ? [
        { label: 'Total karya', value: items.value.length },
        ...present.value.map((p) => ({
          label: p.label as string,
          value: items.value.filter((i) => i.platform === p.key).length
        }))
      ]
    : []
)

const filtered = computed(() =>
  active.value === 'all' ? items.value : items.value.filter((i) => i.platform === active.value)
)
const visible = computed(() => filtered.value.slice(0, limit.value))
const remaining = computed(() => Math.max(0, filtered.value.length - limit.value))

function setFilter(key: string) {
  active.value = key
  limit.value = PAGE
}
function more() {
  limit.value += PAGE
}
async function reload() {
  await Promise.all([load(), rx.load(true)])
}

// --- indikator tab yang meluncur ---
const tabEls: Record<string, HTMLElement> = {}
const ind = reactive({ x: 0, w: 0, ready: false })

function setTabEl(key: string, el: HTMLElement | null) {
  if (el) tabEls[key] = el
}
function updateIndicator() {
  const el = tabEls[active.value]
  if (!el) return
  ind.x = el.offsetLeft
  ind.w = el.offsetWidth
  if (!ind.ready) requestAnimationFrame(() => (ind.ready = true))
}
watch([active, tabs], () => nextTick(updateIndicator), { flush: 'post' })

function scrollTo(id: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

// --- kontak ---
const email = computed(() => (config.public.contactEmail as string) || '')
const primary = computed(() =>
  email.value
    ? { label: email.value, href: `mailto:${email.value}` }
    : { label: 'Kirim DM di Instagram', href: 'https://ig.me/m/by.amruu' }
)
const socials = [
  { name: 'Instagram', handle: '@by.amruu', href: 'https://www.instagram.com/by.amruu/' },
  { name: 'TikTok', handle: '@by.amruu', href: 'https://www.tiktok.com/@by.amruu' },
  { name: 'GitHub', handle: 'by-amruu', href: 'https://github.com/by-amruu' }
]
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email.value)
    toast.success('Email disalin ke clipboard.')
  } catch {
    toast.error('Tidak bisa menyalin otomatis.')
  }
}

const ticker = ['Desain Kemasan', 'Poster & Backdrop', 'Carousel Instagram', 'Konten TikTok', 'Moodboard Pinterest', 'Web App']

onMounted(async () => {
  updateIndicator()
  window.addEventListener('resize', updateIndicator)
  ;(document as any).fonts?.ready?.then(updateIndicator)
  await Promise.all([load(), rx.load(), loadCvData()])
})

onBeforeUnmount(() => window.removeEventListener('resize', updateIndicator))
</script>
