<template>
  <div class="toast-wrap">
    <div class="min-h-0 overflow-hidden">
      <div class="pt-3">
        <article
          class="relative flex w-[min(92vw,380px)] items-start gap-3 border border-ink/15 bg-paper p-4 pr-3 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.45)]"
          role="status"
          @mouseenter="pause"
          @mouseleave="resume"
          @focusin="pause"
          @focusout="resume"
        >
          <span
            class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center"
            :class="
              toast.type === 'error'
                ? 'bg-accent text-paper'
                : toast.type === 'success'
                  ? 'bg-ink text-paper'
                  : 'border border-ink/40 text-ink'
            "
          >
            <Icon :name="toast.type === 'error' ? 'alert' : toast.type === 'success' ? 'check' : 'info'" :size="14" :stroke="2.2" />
          </span>

          <div class="min-w-0 flex-1 pt-px">
            <p v-if="toast.title" class="text-sm font-medium leading-snug">{{ toast.title }}</p>
            <p class="text-sm leading-snug" :class="toast.title ? 'mt-0.5 text-ink/70' : ''">{{ toast.message }}</p>
            <button
              v-if="toast.action"
              type="button"
              class="link-u mt-2 text-sm font-medium"
              @click="runAction"
            >
              {{ toast.action.label }}
            </button>
          </div>

          <button type="button" class="btn-icon !h-7 !w-7 !border-transparent" aria-label="Tutup notifikasi" @click="$emit('close')">
            <Icon name="x" :size="14" />
          </button>

          <span
            class="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left bg-ink/40"
            :style="{ animation: `toast-bar ${toast.duration}ms linear forwards`, animationPlayState: paused ? 'paused' : 'running' }"
          />
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { ToastItem } from '~/composables/useToast'

const props = defineProps({
  toast: { type: Object as PropType<ToastItem>, required: true }
})
const emit = defineEmits<{ close: [] }>()

const paused = ref(false)
let remaining = props.toast.duration
let startedAt = 0
let timer: ReturnType<typeof setTimeout> | undefined

function begin() {
  startedAt = Date.now()
  timer = setTimeout(() => emit('close'), remaining)
}
function pause() {
  if (paused.value) return
  paused.value = true
  clearTimeout(timer)
  remaining -= Date.now() - startedAt
}
function resume() {
  if (!paused.value) return
  paused.value = false
  begin()
}
function runAction() {
  props.toast.action?.onClick()
  emit('close')
}

onMounted(begin)
onBeforeUnmount(() => clearTimeout(timer))
</script>

