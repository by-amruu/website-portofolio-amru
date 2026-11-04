<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="current"
        ref="root"
        class="fixed inset-0 z-50"
        role="dialog"
        aria-modal="true"
        :aria-label="current.title"
      >
        <div class="absolute inset-0 bg-paper/85 backdrop-blur-md" data-cursor="Tutup" @click="close" />

        <div
          class="modal-panel relative mx-auto flex h-full w-full max-w-[1320px] flex-col overflow-y-auto border-ink/15 bg-paper md:my-5 md:h-[calc(100%-2.5rem)] md:flex-row md:overflow-hidden md:border"
        >
          <!-- MEDIA -->
          <div
            class="relative flex min-h-[52vh] flex-1 items-center justify-center bg-ink/[0.045] p-5 md:min-h-0 md:p-10"
            @pointerdown="onSwipeStart"
            @pointerup="onSwipeEnd"
          >
            <Transition :name="direction === 'next' ? 'slide-next' : 'slide-prev'" mode="out-in">
              <figure :key="current.id" class="flex max-h-full max-w-full items-center justify-center">
                <img
                  :src="modalImageUrl"
                  :alt="current.title"
                  draggable="false"
                  class="max-h-[62vh] w-auto max-w-full object-contain shadow-[0_30px_70px_-30px_rgb(0_0_0/0.55)] md:max-h-[calc(100dvh-8.5rem)]"
                />
              </figure>
            </Transition>

            <template v-if="items.length > 1">
              <button
                type="button"
                class="btn-icon absolute left-3 top-1/2 -translate-y-1/2 !bg-paper md:left-5"
                aria-label="Karya sebelumnya"
                @click="go(-1)"
              >
                <Icon name="chevron-left" />
              </button>
              <button
                type="button"
                class="btn-icon absolute right-3 top-1/2 -translate-y-1/2 !bg-paper md:right-5"
                aria-label="Karya berikutnya"
                @click="go(1)"
              >
                <Icon name="chevron-right" />
              </button>
            </template>
          </div>

          <!-- INFO -->
          <aside class="flex w-full shrink-0 flex-col md:w-[400px] md:overflow-y-auto md:border-l md:border-ink/15">
            <div class="flex items-center justify-between border-b border-ink/10 px-6 py-4">
              <p class="label tabular-nums">
                {{ String(index + 1).padStart(2, '0') }} / {{ String(items.length).padStart(2, '0') }}
              </p>
              <button ref="closeBtn" type="button" class="group flex items-center gap-2 text-[13px] text-ink/70 hover:text-ink" @click="close">
                <span class="hidden sm:inline">Tutup</span>
                <kbd class="hidden border border-ink/20 px-1.5 py-0.5 text-[10px] sm:inline">Esc</kbd>
                <span class="btn-icon !h-8 !w-8"><Icon name="x" :size="16" /></span>
              </button>
            </div>

            <Transition name="up" mode="out-in">
              <div :key="current.id" class="flex flex-1 flex-col gap-8 px-6 py-8">
                <div>
                  <p class="label">{{ platformLabel(current.platform) }} · {{ current.category || 'Karya' }}</p>
                  <h2 class="mt-4 font-display text-3xl leading-[1.1] tracking-tight md:text-[2.1rem]">
                    {{ current.title }}
                  </h2>
                </div>

                <p v-if="current.description" class="whitespace-pre-line text-[15px] leading-relaxed text-ink/75">
                  {{ current.description }}
                </p>

                <dl class="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-ink/10 py-5 text-sm">
                  <div>
                    <dt class="label">Platform</dt>
                    <dd class="mt-2">{{ platformLabel(current.platform) }}</dd>
                  </div>
                  <div>
                    <dt class="label">Rasio</dt>
                    <dd class="mt-2 tabular-nums">{{ current.aspect_ratio || '3:4' }}</dd>
                  </div>
                  <div>
                    <dt class="label">Diunggah</dt>
                    <dd class="mt-2">{{ formatMonth(current.created_at) }}</dd>
                  </div>
                  <div v-if="current.tech_stack?.length">
                    <dt class="label">Alat</dt>
                    <dd class="mt-2 leading-snug">{{ current.tech_stack.join(' / ') }}</dd>
                  </div>
                </dl>

                <div>
                  <p class="label mb-2">Reaksi</p>
                  <ReactionBar :item-id="current.id" :size="20" class="-ml-2" />
                </div>

                <div v-if="href" class="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
                  <a :href="href" target="_blank" rel="noopener noreferrer" class="btn-ink">
                    <span>Buka karya asli</span>
                    <Icon name="arrow-up-right" :size="16" />
                  </a>
                  <button type="button" class="link-u inline-flex items-center gap-2 text-sm" @click="copyLink">
                    <Icon name="link" :size="15" />
                    Salin tautan
                  </button>
                </div>
              </div>
            </Transition>
          </aside>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { PortfolioItem } from '~/utils/portfolio'

const props = defineProps({
  items: { type: Array as PropType<PortfolioItem[]>, required: true },
  modelValue: { type: String as PropType<string | null>, default: null }
})
const emit = defineEmits<{ 'update:modelValue': [id: string | null] }>()

const toast = useToast()
const { lock, unlock } = useScrollLock()

const root = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)
const direction = ref<'next' | 'prev'>('next')

const index = computed(() => props.items.findIndex((i) => i.id === props.modelValue))
const current = computed(() => (index.value >= 0 ? props.items[index.value] : null))
const href = computed(() => safeUrl(current.value?.live_url))

// Pada modal, muat gambar jernih (~1400px) berformat WebP dengan kualitas 85%
const modalImageUrl = computed(() => {
  if (!current.value?.preview_url) return ''
  return getOptimizedImageUrl(current.value.preview_url, {
    width: 1440,
    quality: 85,
    format: 'webp'
  })
})

let previous: HTMLElement | null = null

function close() {
  emit('update:modelValue', null)
}

function go(step: 1 | -1) {
  const n = props.items.length
  if (n < 2 || index.value < 0) return
  direction.value = step === 1 ? 'next' : 'prev'
  emit('update:modelValue', props.items[(index.value + step + n) % n].id)
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(href.value)
    toast.success('Tautan karya disalin.')
  } catch {
    toast.error('Tidak bisa menyalin otomatis. Salin dari tombol "Buka karya asli".')
  }
}

// Geser jari/kursor ke samping untuk pindah karya
let swipeX = 0
function onSwipeStart(e: PointerEvent) {
  swipeX = e.clientX
}
function onSwipeEnd(e: PointerEvent) {
  const dx = e.clientX - swipeX
  if (e.pointerType === 'touch' && Math.abs(dx) > 60) go(dx < 0 ? 1 : -1)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
  else if (e.key === 'Tab' && root.value) {
    // jebakan fokus sederhana
    const f = Array.from(
      root.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null)
    if (!f.length) return
    const first = f[0]
    const last = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

// Muat gambar tetangga lebih dulu supaya perpindahan terasa instan
function preloadNeighbours() {
  const n = props.items.length
  if (n < 2 || index.value < 0) return
  for (const step of [1, -1]) {
    const item = props.items[(index.value + step + n) % n]
    const img = new Image()
    img.src = item.preview_url
  }
}

watch(
  () => !!current.value,
  async (open) => {
    if (!import.meta.client) return
    if (open) {
      previous = document.activeElement as HTMLElement | null
      lock()
      window.addEventListener('keydown', onKey)
      await nextTick()
      closeBtn.value?.focus({ preventScroll: true })
    } else {
      unlock()
      window.removeEventListener('keydown', onKey)
      previous?.focus?.({ preventScroll: true })
      previous = null
    }
  }
)
watch(index, () => {
  if (import.meta.client) preloadNeighbours()
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', onKey)
  }
  if (current.value) unlock()
})
</script>

