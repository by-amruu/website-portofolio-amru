<template>
  <div
    v-if="enabled"
    ref="el"
    class="pointer-events-none fixed left-0 top-0 z-[60]"
    style="will-change: transform"
    aria-hidden="true"
  >
    <div
      class="grid h-[84px] w-[84px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-[11px] font-medium tracking-wide text-paper transition-[transform,opacity] duration-300 ease-out"
      :class="active ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Label yang mengikuti kursor. Muncul di atas elemen ber-atribut
 * data-cursor="Teks" (kartu karya, backdrop modal). Hanya untuk perangkat
 * dengan mouse; layar sentuh tidak memakainya.
 */
const el = ref<HTMLElement | null>(null)
const enabled = ref(false)
const active = ref(false)
const text = ref('')

let x = 0
let y = 0
let tx = 0
let ty = 0
let raf = 0
let moving = false

function tick() {
  x += (tx - x) * 0.2
  y += (ty - y) * 0.2
  if (el.value) el.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
  if (active.value || Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) {
    raf = requestAnimationFrame(tick)
  } else {
    moving = false
  }
}

function onMove(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  tx = e.clientX
  ty = e.clientY
  const target = (e.target as Element | null)?.closest?.('[data-cursor]')
  const label = target?.getAttribute('data-cursor') ?? ''
  if (label) {
    if (!active.value) {
      x = tx
      y = ty
    }
    text.value = label
    active.value = true
  } else {
    active.value = false
  }
  if (!moving) {
    moving = true
    raf = requestAnimationFrame(tick)
  }
}

function onLeave() {
  active.value = false
}

onMounted(() => {
  enabled.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!enabled.value) return
  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('mouseleave', onLeave)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('pointermove', onMove)
  document.documentElement.removeEventListener('mouseleave', onLeave)
})
</script>

