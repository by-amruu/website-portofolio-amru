<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div class="absolute inset-0 bg-paper/70 backdrop-blur-sm" @click="requestClose" />

        <aside
          class="drawer-panel absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-ink/20 bg-paper shadow-[-30px_0_70px_-35px_rgb(0_0_0/0.6)]"
        >
          <!-- header -->
          <div class="flex items-start justify-between gap-4 border-b border-ink/10 px-6 py-5 sm:px-8">
            <div>
              <p class="label">{{ item ? 'Edit karya' : 'Karya baru' }}</p>
              <h2 id="drawer-title" class="mt-2 font-display text-2xl tracking-tight">
                {{ form.title || 'Tanpa judul' }}
              </h2>
            </div>
            <button type="button" class="btn-icon shrink-0" aria-label="Tutup panel" @click="requestClose">
              <Icon name="x" :size="16" />
            </button>
          </div>

          <!-- isi -->
          <div class="flex-1 space-y-10 overflow-y-auto px-6 py-8 sm:px-8">
            <!-- 1. GAMBAR -->
            <section class="rise-in" style="--d: 40ms">
              <p class="label mb-3">1 · Gambar preview</p>

              <div class="flex gap-5">
                <!-- bingkai sesuai rasio -->
                <div
                  class="relative shrink-0 overflow-hidden border border-ink/20 bg-ink/[0.05] transition-[width,aspect-ratio] duration-500 ease-out"
                  :class="[aspectClass(form.aspect_ratio), form.aspect_ratio === '16:9' ? 'w-44' : 'w-28']"
                >
                  <img
                    v-if="form.preview_url && !imgFailed"
                    :src="form.preview_url"
                    alt="Pratinjau gambar karya"
                    class="absolute inset-0 h-full w-full object-cover"
                    @error="imgFailed = true"
                    @load="imgFailed = false"
                  />
                  <div v-else class="absolute inset-0 grid place-items-center p-3 text-center text-[11px] leading-snug text-ink/55">
                    {{ imgFailed ? 'Gambar tidak bisa dimuat' : 'Belum ada gambar' }}
                  </div>
                  <div v-if="uploading" class="absolute inset-0 grid place-items-center bg-paper/70 backdrop-blur-[2px]">
                    <span class="h-5 w-5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                  </div>
                </div>

                <div class="min-w-0 flex-1 space-y-3">
                  <label
                    class="group flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-6 text-center transition-colors duration-200"
                    :class="dragging ? 'border-accent bg-accent/10' : 'border-ink/30 hover:border-ink hover:bg-ink/[0.04]'"
                    @dragenter.prevent="dragging = true"
                    @dragover.prevent="dragging = true"
                    @dragleave.prevent="dragging = false"
                    @drop.prevent="onDrop"
                  >
                    <Icon name="upload" :size="20" class="transition-transform duration-300 group-hover:-translate-y-0.5" />
                    <span class="text-sm font-medium">{{ uploading ? 'Mengunggah…' : 'Pilih, seret, atau tempel gambar' }}</span>
                    <span class="text-[11px] text-ink/60">JPG, PNG, WebP · maks 8 MB · Ctrl+V untuk menempel screenshot</span>
                    <input type="file" accept="image/*" class="sr-only" :disabled="uploading" @change="onPick" />
                  </label>

                  <div>
                    <label for="f-preview" class="text-[12px] text-ink/65">atau tempel URL gambar</label>
                    <input
                      id="f-preview"
                      v-model="form.preview_url"
                      class="field mt-1.5 text-[13px]"
                      :aria-invalid="!!errors.preview_url"
                      placeholder="https://…"
                      inputmode="url"
                      @input="imgFailed = false"
                    />
                    <p v-if="errors.preview_url" class="mt-1.5 text-[12px] text-accent" role="alert">{{ errors.preview_url }}</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- 2. INFO -->
            <section class="rise-in space-y-5" style="--d: 100ms">
              <p class="label">2 · Informasi</p>

              <div>
                <label for="f-title" class="text-sm font-medium">Judul karya</label>
                <input
                  id="f-title"
                  ref="titleEl"
                  v-model="form.title"
                  class="field mt-2"
                  :class="{ shake: shakeKey === 'title' }"
                  :aria-invalid="!!errors.title"
                  placeholder="Contoh: Redesign Kemasan Keripik Jamur"
                  maxlength="120"
                />
                <p v-if="errors.title" class="mt-1.5 text-[12px] text-accent" role="alert">{{ errors.title }}</p>
              </div>

              <div>
                <p class="text-sm font-medium" id="f-platform-label">Platform</p>
                <div class="mt-2 grid grid-cols-2 gap-px border border-ink/20 bg-ink/20 sm:grid-cols-4" role="radiogroup" aria-labelledby="f-platform-label">
                  <button
                    v-for="p in PLATFORMS"
                    :key="p.key"
                    type="button"
                    role="radio"
                    :aria-checked="form.platform === p.key"
                    class="px-3 py-2.5 text-[13px] transition-colors duration-200"
                    :class="form.platform === p.key ? 'bg-ink text-paper' : 'bg-paper text-ink/75 hover:bg-ink/[0.06] hover:text-ink'"
                    @click="setPlatform(p.key)"
                  >
                    {{ p.label }}
                  </button>
                </div>
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label for="f-category" class="text-sm font-medium">Kategori</label>
                  <input id="f-category" v-model="form.category" class="field mt-2" placeholder="Desain Kemasan" maxlength="60" />
                </div>
                <div>
                  <label for="f-live" class="text-sm font-medium">Tautan karya asli</label>
                  <input
                    id="f-live"
                    v-model="form.live_url"
                    class="field mt-2"
                    :aria-invalid="!!errors.live_url"
                    placeholder="instagram.com/p/… atau situs"
                    inputmode="url"
                  />
                  <p v-if="errors.live_url" class="mt-1.5 text-[12px] text-accent" role="alert">{{ errors.live_url }}</p>
                </div>
              </div>

              <div>
                <label for="f-desc" class="text-sm font-medium">Deskripsi</label>
                <textarea
                  id="f-desc"
                  v-model="form.description"
                  class="field mt-2"
                  rows="3"
                  maxlength="600"
                  placeholder="Ceritakan konsep atau proses singkat karya ini."
                />
                <p class="mt-1 text-right text-[11px] tabular-nums text-ink/55">{{ form.description.length }} / 600</p>
              </div>

              <div>
                <label for="f-tags" class="text-sm font-medium">Alat / tag</label>
                <div
                  class="field mt-2 flex flex-wrap items-center gap-2 !py-2 focus-within:border-accent"
                  @click="tagEl?.focus()"
                >
                  <span
                    v-for="t in form.tags"
                    :key="t"
                    class="inline-flex items-center gap-1.5 border border-ink/25 bg-ink/[0.06] py-1 pl-2.5 pr-1 text-[12px]"
                  >
                    {{ t }}
                    <button type="button" class="grid h-5 w-5 place-items-center hover:bg-ink hover:text-paper" :aria-label="`Hapus tag ${t}`" @click.stop="removeTag(t)">
                      <Icon name="x" :size="12" />
                    </button>
                  </span>
                  <input
                    id="f-tags"
                    ref="tagEl"
                    v-model="tagDraft"
                    class="min-w-[8rem] flex-1 bg-transparent py-1 text-[13px] outline-none placeholder:text-ink/40"
                    placeholder="Ketik lalu Enter"
                    @keydown="onTagKey"
                    @blur="commitTag"
                  />
                </div>
              </div>
            </section>

            <!-- 3. TAMPILAN -->
            <section class="rise-in space-y-5" style="--d: 160ms">
              <p class="label">3 · Tampilan di situs</p>

              <div>
                <p class="text-sm font-medium" id="f-ratio-label">Rasio kartu</p>
                <div class="mt-2 grid grid-cols-3 gap-3" role="radiogroup" aria-labelledby="f-ratio-label">
                  <button
                    v-for="r in RATIOS"
                    :key="r.key"
                    type="button"
                    role="radio"
                    :aria-checked="form.aspect_ratio === r.key"
                    class="group flex flex-col items-center gap-3 border px-3 py-4 transition-colors duration-200"
                    :class="form.aspect_ratio === r.key ? 'border-ink bg-ink/[0.06]' : 'border-ink/20 hover:border-ink/50'"
                    @click="setRatio(r.key)"
                  >
                    <span
                      class="block border-2 transition-colors duration-200"
                      :class="[
                        form.aspect_ratio === r.key ? 'border-accent' : 'border-ink/40 group-hover:border-ink/70',
                        r.key === '16:9' ? 'h-6 w-11' : r.key === '9:16' ? 'h-11 w-6' : 'h-10 w-[30px]'
                      ]"
                    />
                    <span class="text-center">
                      <span class="block text-[13px] font-medium tabular-nums">{{ r.label }}</span>
                      <span class="block text-[11px] text-ink/60">{{ r.hint }}</span>
                    </span>
                  </button>
                </div>
                <p class="mt-2 text-[12px] text-ink/60">Rasio 16:9 otomatis memakai lebar dua kolom di grid.</p>
              </div>

              <div class="flex items-center justify-between gap-4 border-y border-ink/10 py-4">
                <div>
                  <p class="text-sm font-medium">Sematkan di urutan teratas</p>
                  <p class="text-[12px] text-ink/60">Karya ini tampil lebih dulu di situs.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  :aria-checked="form.pinned"
                  aria-label="Sematkan di urutan teratas"
                  class="relative h-6 w-11 shrink-0 border transition-colors duration-300"
                  :class="form.pinned ? 'border-accent bg-accent' : 'border-ink/30 bg-ink/[0.06]'"
                  @click="form.pinned = !form.pinned"
                >
                  <span
                    class="absolute left-0.5 top-0.5 h-4 w-4 bg-paper transition-transform duration-300 ease-out"
                    :class="form.pinned ? 'translate-x-5' : 'translate-x-0 !bg-ink'"
                  />
                </button>
              </div>
            </section>
          </div>

          <!-- footer -->
          <div class="flex items-center justify-between gap-4 border-t border-ink/10 bg-paper px-6 py-4 sm:px-8">
            <p class="flex items-center gap-2 text-[12px] text-ink/65" aria-live="polite">
              <span class="h-1.5 w-1.5 rounded-full transition-colors" :class="dirty ? 'bg-accent' : 'bg-ink/30'" />
              {{ dirty ? 'Ada perubahan belum disimpan' : 'Belum ada perubahan' }}
            </p>
            <div class="flex items-center gap-5">
              <button type="button" class="link-u text-sm" @click="requestClose">Batal</button>
              <button type="button" class="btn-ink" :disabled="saving || uploading" @click="save">
                <span v-if="saving" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>{{ saving ? 'Menyimpan…' : item ? 'Simpan perubahan' : 'Terbitkan karya' }}</span>
                <kbd v-if="!saving" class="hidden border border-paper/40 px-1.5 py-0.5 text-[10px] font-normal opacity-70 sm:inline">Ctrl S</kbd>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { PortfolioItem } from '~/utils/portfolio'

const props = defineProps({
  open: { type: Boolean, required: true },
  item: { type: Object as PropType<PortfolioItem | null>, default: null }
})
const emit = defineEmits<{ close: []; saved: [mode: 'create' | 'update'] }>()

const supabase = (useNuxtApp() as any).$supabase
const toast = useToast()
const { confirm } = useConfirm()
const { lock, unlock } = useScrollLock()

interface FormState {
  title: string
  platform: string
  category: string
  description: string
  preview_url: string
  live_url: string
  aspect_ratio: string
  tags: string[]
  pinned: boolean
}

const blank = (): FormState => ({
  title: '',
  platform: 'instagram',
  category: 'Creative Work',
  description: '',
  preview_url: '',
  live_url: '',
  aspect_ratio: '3:4',
  tags: [],
  pinned: false
})

const fromItem = (i: PortfolioItem): FormState => ({
  title: i.title ?? '',
  platform: i.platform ?? 'instagram',
  category: i.category ?? '',
  description: i.description ?? '',
  preview_url: i.preview_url ?? '',
  live_url: i.live_url ?? '',
  aspect_ratio: i.aspect_ratio ?? '3:4',
  tags: [...(i.tech_stack ?? [])],
  pinned: (i.order_priority ?? 0) > 0
})

const form = ref<FormState>(blank())
const snapshot = ref('')
const errors = reactive<Record<string, string>>({})
const tagDraft = ref('')
const uploading = ref(false)
const saving = ref(false)
const dragging = ref(false)
const imgFailed = ref(false)
const shakeKey = ref('')
const ratioTouched = ref(false)

const titleEl = ref<HTMLInputElement | null>(null)
const tagEl = ref<HTMLInputElement | null>(null)

const dirty = computed(() => JSON.stringify(form.value) !== snapshot.value)

watch(
  () => props.open,
  async (isOpen) => {
    if (!import.meta.client) return
    if (isOpen) {
      form.value = props.item ? fromItem(props.item) : blank()
      snapshot.value = JSON.stringify(form.value)
      Object.keys(errors).forEach((k) => delete errors[k])
      tagDraft.value = ''
      imgFailed.value = false
      ratioTouched.value = !!props.item
      lock()
      window.addEventListener('keydown', onKey)
      window.addEventListener('paste', onPaste)
      await nextTick()
      setTimeout(() => titleEl.value?.focus({ preventScroll: true }), 350)
    } else {
      unlock()
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('paste', onPaste)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('paste', onPaste)
  }
  if (props.open) unlock()
})

// --- penutupan ---
async function requestClose() {
  if (saving.value) return
  if (dirty.value) {
    const ok = await confirm({
      title: 'Buang perubahan?',
      message: 'Isian yang belum disimpan akan hilang.',
      confirmText: 'Ya, buang',
      cancelText: 'Lanjut mengedit',
      tone: 'danger'
    })
    if (!ok) return
  }
  emit('close')
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') requestClose()
  else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault()
    save()
  }
}

// --- pilihan form ---
function setPlatform(key: string) {
  form.value.platform = key
  // saran rasio otomatis selama belum diubah manual
  if (!ratioTouched.value) form.value.aspect_ratio = key === 'tiktok' ? '9:16' : key === 'website' ? '16:9' : '3:4'
}
function setRatio(key: string) {
  ratioTouched.value = true
  form.value.aspect_ratio = key
}

// --- tag ---
function commitTag() {
  const t = tagDraft.value.replace(/,/g, '').trim()
  tagDraft.value = ''
  if (!t) return
  if (form.value.tags.length >= 8) {
    toast.info('Maksimal 8 tag.')
    return
  }
  if (!form.value.tags.some((x) => x.toLowerCase() === t.toLowerCase())) form.value.tags.push(t)
}
function removeTag(t: string) {
  form.value.tags = form.value.tags.filter((x) => x !== t)
}
function onTagKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    commitTag()
  } else if (e.key === 'Backspace' && !tagDraft.value) {
    form.value.tags.pop()
  }
}

// --- unggah ---
async function upload(file: File) {
  if (!file.type.startsWith('image/')) {
    toast.error('File harus berupa gambar.')
    return
  }
  if (file.size > 8 * 1024 * 1024) {
    toast.error('Ukuran gambar maksimal 8 MB.')
    return
  }
  if (!supabase) {
    toast.error('Database belum dikonfigurasi.')
    return
  }
  uploading.value = true
  try {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const name = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage
      .from('portfolio-media')
      .upload(name, file, { cacheControl: '31536000', upsert: false, contentType: file.type })
    if (error) throw error
    const { data } = supabase.storage.from('portfolio-media').getPublicUrl(name)
    form.value.preview_url = data.publicUrl
    imgFailed.value = false
    delete errors.preview_url
    toast.success('Gambar terunggah.')
  } catch (err: any) {
    toast.error(err?.message || 'Unggah gagal.', { title: 'Unggah gagal' })
  } finally {
    uploading.value = false
  }
}

function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) upload(file)
  input.value = ''
}
function onDrop(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) upload(file)
}
function onPaste(e: ClipboardEvent) {
  const file = Array.from(e.clipboardData?.files ?? []).find((f) => f.type.startsWith('image/'))
  if (file) {
    e.preventDefault()
    upload(file)
  }
}

// --- simpan ---
function validate(): string | null {
  Object.keys(errors).forEach((k) => delete errors[k])
  form.value.preview_url = form.value.preview_url.trim()
  form.value.live_url = normalizeUrl(form.value.live_url)

  if (!form.value.title.trim()) errors.title = 'Judul wajib diisi.'
  if (!form.value.preview_url) errors.preview_url = 'Unggah gambar atau tempel URL gambar.'
  else if (!isHttpUrl(form.value.preview_url)) errors.preview_url = 'URL gambar harus diawali http:// atau https://'
  if (form.value.live_url && !isHttpUrl(form.value.live_url)) errors.live_url = 'Tautan tidak valid.'

  return Object.keys(errors)[0] ?? null
}

async function save() {
  if (saving.value || uploading.value) return
  const firstBad = validate()
  if (firstBad) {
    shakeKey.value = firstBad
    setTimeout(() => (shakeKey.value = ''), 600)
    toast.error('Lengkapi isian yang ditandai dulu.')
    if (firstBad === 'title') titleEl.value?.focus()
    return
  }
  if (!supabase) {
    toast.error('Database belum dikonfigurasi.')
    return
  }

  const f = form.value
  const wasPinned = (props.item?.order_priority ?? 0) > 0
  const payload = {
    title: f.title.trim(),
    platform: f.platform,
    category: f.category.trim() || 'Creative Work',
    description: f.description.trim() || null,
    preview_url: f.preview_url,
    live_url: f.live_url || null,
    aspect_ratio: f.aspect_ratio,
    tech_stack: f.tags,
    order_priority: f.pinned === wasPinned && props.item ? props.item.order_priority ?? 0 : f.pinned ? 10 : 0
  }

  saving.value = true
  const mode = props.item ? 'update' : 'create'
  const { error } = props.item
    ? await supabase.from('portfolio_items').update(payload).eq('id', props.item.id)
    : await supabase.from('portfolio_items').insert([payload])
  saving.value = false

  if (error) {
    toast.error(error.message, { title: 'Gagal menyimpan' })
    return
  }
  snapshot.value = JSON.stringify(form.value)
  emit('saved', mode)
}
</script>
