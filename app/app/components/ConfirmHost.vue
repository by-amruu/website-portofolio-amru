<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="state.open"
        class="fixed inset-0 z-[55] grid place-items-center p-4"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        :aria-describedby="state.message ? 'confirm-message' : undefined"
      >
        <div class="absolute inset-0 bg-paper/70 backdrop-blur-sm" @click="settle(false)" />

        <div
          class="modal-panel relative w-full max-w-md border border-ink/20 bg-paper p-6 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)] sm:p-8"
        >
          <span
            v-if="state.tone === 'danger'"
            class="absolute inset-x-0 top-0 h-[3px] origin-left bg-accent"
            style="animation: rise-fade 0.6s var(--ease) both"
          />
          <p class="label" :class="state.tone === 'danger' ? '!text-accent' : ''">
            {{ state.tone === 'danger' ? 'Tindakan permanen' : 'Konfirmasi' }}
          </p>
          <h2 id="confirm-title" class="mt-3 font-display text-2xl leading-tight">{{ state.title }}</h2>
          <p v-if="state.message" id="confirm-message" class="mt-3 text-sm leading-relaxed text-ink/70">
            {{ state.message }}
          </p>

          <div class="mt-8 flex items-center justify-end gap-6">
            <button ref="cancelBtn" type="button" class="link-u text-sm" @click="settle(false)">
              {{ state.cancelText }}
            </button>
            <button ref="okBtn" type="button" class="btn-ink" :class="state.tone === 'danger' ? 'btn-danger' : ''" @click="settle(true)">
              <span>{{ state.confirmText }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { state, settle } = useConfirm()
const { lock, unlock } = useScrollLock()

const cancelBtn = ref<HTMLButtonElement | null>(null)
const okBtn = ref<HTMLButtonElement | null>(null)
let previous: HTMLElement | null = null

// Capture-phase: berjalan lebih dulu dari handler Esc milik drawer/modal di bawahnya.
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation()
    settle(false)
  } else if (e.key === 'Tab') {
    const a = cancelBtn.value
    const b = okBtn.value
    if (!a || !b) return
    if (e.shiftKey && document.activeElement === a) {
      e.preventDefault()
      b.focus()
    } else if (!e.shiftKey && document.activeElement === b) {
      e.preventDefault()
      a.focus()
    }
  }
}

watch(
  () => state.value.open,
  async (open) => {
    if (!import.meta.client) return
    if (open) {
      previous = document.activeElement as HTMLElement | null
      lock()
      window.addEventListener('keydown', onKey, true)
      await nextTick()
      // Fokus awal ke "Batal" agar Enter tidak langsung menghapus.
      cancelBtn.value?.focus()
    } else {
      unlock()
      window.removeEventListener('keydown', onKey, true)
      previous?.focus?.()
      previous = null
    }
  }
)

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', onKey, true)
  }
  if (state.value.open) unlock()
})
</script>

