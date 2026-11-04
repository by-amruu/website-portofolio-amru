<template>
  <canvas ref="canvas" class="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden="true" />
</template>

<script setup lang="ts">
/**
 * Latar interaktif: kisi tanda "+" ala lembar cetak.
 *  - gelombang ambient merambat pelan menyilang layar
 *  - tanda di dekat kursor membesar, menjauh, dan berubah ke warna aksen
 *  - klik memancarkan riak
 *  - grid bergeser sedikit mengikuti scroll (parallax)
 * Tanpa gambar/blur: murni canvas 2D, berhenti saat tab tidak aktif,
 * dan statis bila pengguna memilih "kurangi gerakan".
 */
const canvas = ref<HTMLCanvasElement | null>(null)

const GAP = 36
const REACH = 190
const RIPPLE_MS = 1700

let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let running = false
let reduce = false
let w = 0
let h = 0
let scrollY = 0
let lastColorRead = -1000
let resizeTimer: ReturnType<typeof setTimeout> | undefined

const ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999 }
const ripples: { x: number; y: number; t: number }[] = []
const ink = [237, 234, 227]
let inkTarget = [237, 234, 227]
let accent = [255, 106, 61]

function parseVar(name: string): number[] | null {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const parts = raw.split(/\s+/).map(Number)
  return parts.length === 3 && parts.every((n) => !Number.isNaN(n)) ? parts : null
}

function readColors() {
  inkTarget = parseVar('--ink') ?? inkTarget
  accent = parseVar('--accent') ?? accent
}

function resize() {
  if (!canvas.value) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth
  h = window.innerHeight
  canvas.value.width = Math.round(w * dpr)
  canvas.value.height = Math.round(h * dpr)
  ctx = canvas.value.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  if (reduce || !running) draw(0)
}

function mix(a: number, b: number, k: number) {
  return Math.round(a + (b - a) * k)
}

function draw(t: number) {
  if (!ctx) return
  if (t - lastColorRead > 400) {
    readColors()
    lastColorRead = t
  }
  for (let k = 0; k < 3; k++) ink[k] += (inkTarget[k] - ink[k]) * 0.08
  ptr.x += (ptr.tx - ptr.x) * 0.14
  ptr.y += (ptr.ty - ptr.y) * 0.14

  ctx.clearRect(0, 0, w, h)

  const offY = reduce ? 0 : -((scrollY * 0.18) % GAP)
  const cols = Math.ceil(w / GAP) + 1
  const rows = Math.ceil(h / GAP) + 2
  const time = reduce ? 0 : t
  const hot: number[] = []

  ctx.fillStyle = `rgb(${ink[0] | 0},${ink[1] | 0},${ink[2] | 0})`

  for (let j = -1; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let x = i * GAP + GAP / 2
      let y = j * GAP + GAP / 2 + offY

      const wave = Math.sin(x * 0.0045 + y * 0.003 - time * 0.0006) * 0.5 + 0.5
      let alpha = 0.07 + 0.09 * wave * wave
      let arm = 2 + 1.6 * wave
      let heat = 0

      const dx = x - ptr.x
      const dy = y - ptr.y
      const d2 = dx * dx + dy * dy
      if (d2 < REACH * REACH) {
        const d = Math.sqrt(d2)
        let k = 1 - d / REACH
        k = k * k * (3 - 2 * k)
        if (d > 0.01) {
          x += (dx / d) * k * 10
          y += (dy / d) * k * 10
        }
        arm += 7 * k
        alpha += 0.55 * k
        heat = k
      }

      for (let r = 0; r < ripples.length; r++) {
        const age = (t - ripples[r].t) / RIPPLE_MS
        if (age >= 1) continue
        const rx = x - ripples[r].x
        const ry = y - ripples[r].y
        const ring = Math.abs(Math.sqrt(rx * rx + ry * ry) - age * Math.max(w, h) * 0.55)
        if (ring < 46) {
          const kk = (1 - ring / 46) * (1 - age)
          heat = Math.max(heat, kk)
          arm += 6 * kk
          alpha += 0.6 * kk
        }
      }

      if (heat > 0.04) {
        hot.push(x, y, heat, arm)
        continue
      }
      ctx.globalAlpha = Math.min(alpha, 0.5)
      ctx.fillRect(x - arm, y - 0.5, arm * 2, 1)
      ctx.fillRect(x - 0.5, y - arm, 1, arm * 2)
    }
  }

  // Titik yang "panas" digambar terpisah dengan warna campuran tinta -> aksen
  for (let n = 0; n < hot.length; n += 4) {
    const k = hot[n + 2]
    const arm = hot[n + 3]
    ctx.fillStyle = `rgb(${mix(ink[0], accent[0], k)},${mix(ink[1], accent[1], k)},${mix(ink[2], accent[2], k)})`
    ctx.globalAlpha = Math.min(0.25 + k * 0.75, 1)
    ctx.fillRect(hot[n] - arm, hot[n + 1] - 0.5, arm * 2, 1)
    ctx.fillRect(hot[n] - 0.5, hot[n + 1] - arm, 1, arm * 2)
  }
  ctx.globalAlpha = 1

  while (ripples.length && t - ripples[0].t > RIPPLE_MS) ripples.shift()
}

function loop(t: number) {
  if (!running) return
  draw(t)
  raf = requestAnimationFrame(loop)
}

function start() {
  if (running || reduce) return
  running = true
  raf = requestAnimationFrame(loop)
}

function stop() {
  running = false
  cancelAnimationFrame(raf)
}

function onMove(e: PointerEvent) {
  if (ptr.tx === -9999) {
    ptr.x = e.clientX
    ptr.y = e.clientY
  }
  ptr.tx = e.clientX
  ptr.ty = e.clientY
}

function onDown(e: PointerEvent) {
  if (reduce) return
  ripples.push({ x: e.clientX, y: e.clientY, t: performance.now() })
  if (ripples.length > 6) ripples.shift()
}

function onLeave() {
  ptr.tx = ptr.ty = ptr.x = ptr.y = -9999
}

function onScroll() {
  scrollY = window.scrollY
}

function onVisibility() {
  if (document.hidden) stop()
  else start()
}

function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(resize, 120)
}

onMounted(() => {
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  scrollY = window.scrollY
  readColors()
  ink[0] = inkTarget[0]
  ink[1] = inkTarget[1]
  ink[2] = inkTarget[2]
  resize()

  window.addEventListener('resize', onResize)
  if (!reduce) {
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    start()
  }
})

onBeforeUnmount(() => {
  stop()
  clearTimeout(resizeTimer)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerdown', onDown)
  window.removeEventListener('scroll', onScroll)
  document.documentElement.removeEventListener('mouseleave', onLeave)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

