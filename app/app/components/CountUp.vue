<template>
  <span ref="el" class="tabular-nums">{{ shown.toLocaleString('id-ID') }}</span>
</template>

<script setup lang="ts">
/** Angka yang menghitung naik saat pertama kali terlihat, lalu mengikuti perubahan nilai. */
const props = defineProps<{ value: number; duration?: number }>()

const el = ref<HTMLElement | null>(null)
const shown = ref(0)
let started = false
let raf = 0
let io: IntersectionObserver | null = null

function run(to: number) {
  cancelAnimationFrame(raf)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = to
    return
  }
  const from = shown.value
  const total = props.duration ?? 1300
  const t0 = performance.now()
  const step = (t: number) => {
    const p = Math.min((t - t0) / total, 1)
    shown.value = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 4)))
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  if (!el.value) return
  io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        started = true
        run(props.value)
        io?.disconnect()
      }
    },
    { threshold: 0.4 }
  )
  io.observe(el.value)
})

watch(
  () => props.value,
  (v) => {
    if (started) run(v)
  }
)

onBeforeUnmount(() => {
  io?.disconnect()
  cancelAnimationFrame(raf)
})
</script>

