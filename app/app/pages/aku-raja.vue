<template>
  <div class="mx-auto max-w-[1200px] px-5 pb-28 pt-28 sm:px-8 md:pt-36">
    <Transition name="swap" mode="out-in">
      <!-- ================= LOGIN ================= -->
      <section v-if="!authed" key="login" class="grid min-h-[60vh] place-items-center">
        <form class="w-full max-w-sm" :class="{ shake: shaking }" novalidate @submit.prevent="login">
          <p class="label">Area pribadi</p>
          <h1 class="mt-4 font-display text-6xl leading-none tracking-[-0.04em]">Masuk<span class="text-accent">.</span></h1>
          <p class="mt-5 text-sm leading-relaxed text-ink/70">
            Khusus pemilik portofolio. Masukkan kata sandi untuk menambah, mengubah, atau menghapus karya.
          </p>

          <div class="mt-10">
            <label for="pw" class="label">Kata sandi</label>
            <div class="relative mt-3">
              <input
                id="pw"
                ref="pwEl"
                v-model="password"
                :type="showPw ? 'text' : 'password'"
                class="field pr-28"
                autocomplete="current-password"
                :aria-invalid="!!loginError"
                aria-describedby="pw-err"
                @input="loginError = ''"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/65 hover:text-ink"
                @click="showPw = !showPw"
              >
                {{ showPw ? 'Sembunyikan' : 'Tampilkan' }}
              </button>
            </div>
            <p id="pw-err" class="mt-3 min-h-[1.25rem] text-sm text-accent" role="alert">{{ loginError }}</p>
          </div>

          <button type="submit" class="btn-ink mt-4 w-full justify-center">
            <span>Buka konsol</span>
            <Icon name="arrow-right" :size="16" />
          </button>
        </form>
      </section>

      <!-- ================= DASHBOARD ================= -->
      <section v-else key="dash">
        <header class="flex flex-wrap items-end justify-between gap-6 border-b border-ink/10 pb-8">
          <div>
            <p class="label flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-accent" /> Sesi aktif
            </p>
            <h1 class="mt-3 font-display text-5xl leading-none tracking-[-0.04em] md:text-7xl">Kelola karya</h1>
          </div>
          <div class="flex items-center gap-6">
            <button type="button" class="link-u inline-flex items-center gap-2 text-sm text-ink/75 hover:text-ink" @click="logout">
              <Icon name="logout" :size="15" /> Keluar
            </button>
            <button type="button" class="btn-ink" @click="openNew">
              <Icon name="plus" :size="16" />
              <span>Karya baru</span>
            </button>
          </div>
        </header>

        <!-- statistik -->
        <dl class="rise-in mt-8 grid grid-cols-2 gap-px border border-ink/15 bg-ink/15 md:grid-cols-3 lg:grid-cols-6" style="--d: 60ms">
          <div v-for="s in stats" :key="s.label" class="bg-paper p-5">
            <dt class="label">{{ s.label }}</dt>
            <dd class="mt-3 font-display text-4xl tracking-tight"><CountUp :value="s.value" :duration="900" /></dd>
          </div>
        </dl>

        <!-- alat -->
        <div class="mt-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div class="relative md:w-80">
            <Icon name="search" :size="16" class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/55" />
            <input v-model="query" class="field !pl-10" placeholder="Cari judul atau kategori…" aria-label="Cari karya" />
          </div>
          <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm" role="tablist" aria-label="Filter platform">
            <button
              v-for="t in filterTabs"
              :key="t.key"
              type="button"
              role="tab"
              :aria-selected="filter === t.key"
              class="relative pb-1.5 transition-colors"
              :class="filter === t.key ? 'text-ink' : 'text-ink/60 hover:text-ink'"
              @click="filter = t.key"
            >
              {{ t.label }} <sup class="text-[10px] tabular-nums">{{ t.count }}</sup>
              <span
                class="absolute inset-x-0 bottom-0 h-px origin-left bg-accent transition-transform duration-300 ease-out"
                :class="filter === t.key ? 'scale-x-100' : 'scale-x-0'"
              />
            </button>
          </div>
        </div>

        <!-- daftar -->
        <div class="mt-6">
          <div v-if="loading" class="space-y-3" aria-busy="true">
            <div v-for="n in 4" :key="n" class="skeleton h-24" />
          </div>

          <div v-else-if="!list.length" class="border border-dashed border-ink/25 px-6 py-20 text-center">
            <p class="font-display text-2xl">{{ items.length ? 'Tidak ada yang cocok.' : 'Belum ada karya.' }}</p>
            <p class="mt-2 text-sm text-ink/65">
              {{ items.length ? 'Coba kata kunci atau filter lain.' : 'Tambahkan karya pertama Anda untuk mulai mengisi portofolio.' }}
            </p>
            <button v-if="!items.length" type="button" class="btn-ink mt-6" @click="openNew">
              <Icon name="plus" :size="16" /><span>Tambah karya pertama</span>
            </button>
          </div>

          <TransitionGroup v-else name="row" tag="ul" class="divide-y divide-ink/10 border-y border-ink/10">
            <li
              v-for="(it, i) in list"
              :key="it.id"
              class="rise-in group grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-4 py-4 transition-colors hover:bg-ink/[0.03] sm:gap-6 sm:px-3"
              :style="{ '--d': Math.min(i * 40, 360) + 'ms' }"
            >
              <div class="relative aspect-[4/5] w-[72px] overflow-hidden bg-ink/[0.06]">
                <img :src="it.preview_url" :alt="''" class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" loading="lazy" />
                <span v-if="(it.order_priority ?? 0) > 0" class="absolute left-1 top-1 grid h-5 w-5 place-items-center bg-accent text-paper" title="Disematkan">
                  <Icon name="pin" :size="11" :stroke="2.2" />
                </span>
              </div>

              <div class="min-w-0">
                <p class="label">{{ platformLabel(it.platform) }} · {{ it.aspect_ratio || '3:4' }} · {{ formatMonth(it.created_at) }}</p>
                <h3 class="mt-2 truncate font-display text-xl tracking-tight">{{ it.title }}</h3>
                <p class="mt-1 flex items-center gap-4 text-[13px] text-ink/65">
                  <span class="truncate">{{ it.category || 'Tanpa kategori' }}</span>
                  <span class="inline-flex shrink-0 items-center gap-1.5 tabular-nums" :title="`${rx.totalOf(it.id)} reaksi`">
                    <Icon name="heart" :size="13" /> {{ rx.totalOf(it.id) }}
                  </span>
                </p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="btn-icon"
                  :class="{ 'is-on': (it.order_priority ?? 0) > 0 }"
                  :aria-pressed="(it.order_priority ?? 0) > 0"
                  :aria-label="(it.order_priority ?? 0) > 0 ? 'Lepas sematan' : 'Sematkan di atas'"
                  :title="(it.order_priority ?? 0) > 0 ? 'Lepas sematan' : 'Sematkan di atas'"
                  @click="togglePin(it)"
                >
                  <Icon name="pin" :size="16" />
                </button>
                <button type="button" class="btn-icon" :aria-label="`Edit ${it.title}`" title="Edit" @click="openEdit(it)">
                  <Icon name="pencil" :size="16" />
                </button>
                <button type="button" class="btn-icon is-danger" :aria-label="`Hapus ${it.title}`" title="Hapus" @click="remove(it)">
                  <Icon name="trash" :size="16" />
                </button>
              </div>
            </li>
          </TransitionGroup>
        </div>

        <p v-if="!rx.remote.value" class="mt-8 flex items-start gap-3 border border-ink/15 p-4 text-[13px] leading-relaxed text-ink/70">
          <Icon name="info" :size="16" class="mt-0.5 shrink-0" />
          <span>
            Reaksi pengunjung belum tersimpan di database. Jalankan <code class="bg-ink/10 px-1">docs/REACTIONS_SETUP.sql</code>
            di SQL Editor Supabase agar jumlahnya tercatat.
          </span>
        </p>
      </section>
    </Transition>

    <AdminItemForm :open="formOpen" :item="editing" @close="closeForm" @saved="onSaved" />
  </div>
</template>

<script setup lang="ts">
import type { PortfolioItem } from '~/utils/portfolio'

useHead({
  title: 'Konsol | by.amruu',
  meta: [{ name: 'robots', content: 'noindex,nofollow' }]
})

const ADMIN_PASSWORD = 'amru2026'
const SESSION_KEY = 'admin-session'

const supabase = (useNuxtApp() as any).$supabase
const toast = useToast()
const { confirm } = useConfirm()
const rx = useReactions()

// --- sesi ---
const authed = ref(false)
const password = ref('')
const showPw = ref(false)
const loginError = ref('')
const shaking = ref(false)
const pwEl = ref<HTMLInputElement | null>(null)

function login() {
  if (password.value === ADMIN_PASSWORD) {
    authed.value = true
    password.value = ''
    loginError.value = ''
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* abaikan */
    }
    toast.success('Selamat datang kembali.')
    refresh()
  } else {
    loginError.value = 'Kata sandi salah.'
    shaking.value = true
    setTimeout(() => (shaking.value = false), 550)
    pwEl.value?.focus()
    pwEl.value?.select()
  }
}

function logout() {
  authed.value = false
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* abaikan */
  }
  toast.info('Sesi diakhiri.')
}

// --- data ---
const items = ref<PortfolioItem[]>([])
const loading = ref(false)
const query = ref('')
const filter = ref('all')

async function refresh() {
  if (!supabase) {
    toast.error('Database belum dikonfigurasi.')
    return
  }
  loading.value = true
  const [res] = await Promise.all([
    supabase
      .from('portfolio_items')
      .select('*')
      .order('order_priority', { ascending: false })
      .order('created_at', { ascending: false }),
    rx.load(true)
  ])
  loading.value = false
  if (res.error) toast.error(res.error.message, { title: 'Gagal memuat karya' })
  else items.value = (res.data ?? []) as PortfolioItem[]
}

const filterTabs = computed(() => [
  { key: 'all', label: 'Semua', count: items.value.length },
  ...PLATFORMS.map((p) => ({
    key: p.key as string,
    label: p.label as string,
    count: items.value.filter((i) => i.platform === p.key).length
  }))
])

const stats = computed(() => [
  { label: 'Total karya', value: items.value.length },
  ...PLATFORMS.map((p) => ({ label: p.label as string, value: items.value.filter((i) => i.platform === p.key).length })),
  { label: 'Reaksi', value: rx.grandTotal.value }
])

const list = computed(() => {
  const q = query.value.trim().toLowerCase()
  return items.value.filter((i) => {
    if (filter.value !== 'all' && i.platform !== filter.value) return false
    if (!q) return true
    return `${i.title} ${i.category ?? ''} ${i.description ?? ''}`.toLowerCase().includes(q)
  })
})

// --- form ---
const formOpen = ref(false)
const editing = ref<PortfolioItem | null>(null)

function openNew() {
  editing.value = null
  formOpen.value = true
}
function openEdit(it: PortfolioItem) {
  editing.value = it
  formOpen.value = true
}
function closeForm() {
  formOpen.value = false
}
async function onSaved(mode: 'create' | 'update') {
  formOpen.value = false
  toast.success(mode === 'create' ? 'Karya baru sudah terbit di situs.' : 'Perubahan tersimpan.')
  await refresh()
}

// --- sematan ---
async function togglePin(it: PortfolioItem) {
  const pinned = (it.order_priority ?? 0) > 0
  const next = pinned ? 0 : 10
  const prev = it.order_priority ?? 0
  it.order_priority = next
  const { error } = await supabase.from('portfolio_items').update({ order_priority: next }).eq('id', it.id)
  if (error) {
    it.order_priority = prev
    toast.error(error.message, { title: 'Gagal mengubah sematan' })
    return
  }
  toast.success(pinned ? 'Sematan dilepas.' : 'Karya disematkan di urutan teratas.')
  await refresh()
}

// --- hapus (dengan konfirmasi dan opsi urungkan) ---
async function remove(it: PortfolioItem) {
  const ok = await confirm({
    title: `Hapus “${it.title}”?`,
    message: 'Karya akan hilang dari situs. Anda masih bisa mengurungkannya sesaat setelah dihapus.',
    confirmText: 'Hapus karya',
    tone: 'danger'
  })
  if (!ok) return

  const { error } = await supabase.from('portfolio_items').delete().eq('id', it.id)
  if (error) {
    toast.error(error.message, { title: 'Gagal menghapus' })
    return
  }
  items.value = items.value.filter((x) => x.id !== it.id)
  toast.success(`“${it.title}” dihapus.`, {
    duration: 9000,
    action: { label: 'Urungkan', onClick: () => restore(it) }
  })
}

async function restore(it: PortfolioItem) {
  const { error } = await supabase.from('portfolio_items').insert([it])
  if (error) toast.error(error.message, { title: 'Gagal mengurungkan' })
  else {
    toast.success('Karya dikembalikan.')
    await refresh()
  }
}

onMounted(() => {
  try {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      authed.value = true
      refresh()
      return
    }
  } catch {
    /* abaikan */
  }
  pwEl.value?.focus()
})
</script>
