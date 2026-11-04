<template>
  <figure class="select-none">
    <svg
      viewBox="0 0 320 132"
      class="w-full overflow-visible text-ink"
      role="img"
      :aria-label="`Posisi ${isDay ? 'matahari' : 'bulan'} saat ini: ${phase || 'memuat'}, pukul ${clock}`"
    >
      <!-- cakrawala -->
      <line x1="8" y1="112" x2="312" y2="112" stroke="currentColor" stroke-opacity=".35" />
      <!-- lintasan -->
      <path :d="arc" fill="none" stroke="currentColor" stroke-opacity=".28" stroke-dasharray="2 6" stroke-linecap="round" />
      <!-- bagian yang sudah dilalui -->
      <path
        :d="arc"
        pathLength="100"
        fill="none"
        stroke="rgb(var(--accent))"
        stroke-width="1.6"
        stroke-linecap="round"
        :stroke-dasharray="`${shown * 100} 100`"
      />
      <!-- penanda 06 / 12 / 18 -->
      <g stroke="currentColor" stroke-opacity=".5">
        <line v-for="t in ticks" :key="t.label" :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2" />
      </g>

      <!-- matahari / bulan -->
      <g :transform="`translate(${pos.x} ${pos.y})`">
        <template v-if="isDay">
          <circle r="5" fill="none" stroke="rgb(var(--accent))" class="sp-pulse" />
          <circle r="5.5" fill="rgb(var(--accent))" />
        </template>
        <template v-else>
          <circle r="6.5" fill="currentColor" />
          <circle cx="3" cy="-2" r="5.5" fill="rgb(var(--paper))" />
        </template>
      </g>

      <g fill="currentColor" fill-opacity=".65" font-size="10" font-family="Inter, sans-serif" letter-spacing=".08em">
        <text x="20" y="128" text-anchor="middle">05.30</text>
        <text x="160" y="16" text-anchor="middle" fill-opacity=".45">12.00</text>
        <text x="300" y="128" text-anchor="middle">18.00</text>
      </g>
    </svg>

    <figcaption class="mt-4 flex items-baseline justify-between">
      <span class="font-display text-2xl tracking-tight">{{ phase || '\u00A0' }}</span>
      <span class="label tabular-nums">{{ clock }} · waktu setempat</span>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
/**
 * Lintasan matahari (05.30-18.00) dan bulan (18.00-05.30) berdasarkan jam
 * perangkat. Titiknya bergerak sepanjang busur, bukan sekadar teks jam.
 */
const { minutes, clock, phase } = useTheme()

const R = { cx: 160, cy: 112, rx: 140, ry: 92 }
const DAY_START = 330
const DAY_END = 1080

const isDay = computed(() => minutes.value >= DAY_START && minutes.value < DAY_END)
const target = computed(() => {
  const m = minutes.value
  if (isDay.value) return (m - DAY_START) / (DAY_END - DAY_START)
  const shifted = m < DAY_START ? m + 1440 : m
  return (shifted - DAY_END) / (DAY_START + 1440 - DAY_END)
})

const arc = `M ${R.cx - R.rx} ${R.cy} A ${R.rx} ${R.ry} 0 0 1 ${R.cx + R.rx} ${R.cy}`

const shown = ref(0)
let raf = 0

function animateTo(to: number) {
  cancelAnimationFrame(raf)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = to
    return
  }
  const from = shown.value
  const t0 = performance.now()
  const step = (t: number) => {
    const p = Math.min((t - t0) / 1800, 1)
    shown.value = from + (to - from) * (1 - Math.pow(1 - p, 3))
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

const pos = computed(() => {
  const a = shown.value * Math.PI
  return { x: R.cx - R.rx * Math.cos(a), y: R.cy - R.ry * Math.sin(a) }
})

// Penanda di 06.00 / 12.00 / 18.00 pada lintasan siang
const ticks = computed(() =>
  [
    { label: '06', p: (360 - DAY_START) / (DAY_END - DAY_START) },
    { label: '12', p: (720 - DAY_START) / (DAY_END - DAY_START) },
    { label: '15', p: (900 - DAY_START) / (DAY_END - DAY_START) }
  ].map((t) => {
    const a = t.p * Math.PI
    const ox = R.cx - R.rx * Math.cos(a)
    const oy = R.cy - R.ry * Math.sin(a)
    const ix = R.cx - (R.rx - 7) * Math.cos(a)
    const iy = R.cy - (R.ry - 7) * Math.sin(a)
    return { label: t.label, x1: ox, y1: oy, x2: ix, y2: iy }
  })
)

onMounted(() => requestAnimationFrame(() => animateTo(target.value)))
watch(target, (v) => animateTo(v))
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

