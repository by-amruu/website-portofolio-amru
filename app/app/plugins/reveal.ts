import type { Directive } from 'vue'

let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )
  }
  return observer
}

/**
 * v-reveal="delayMs": elemen dengan class `reveal` muncul saat masuk viewport.
 * Class `reveal` ditulis langsung di template agar sudah ada di HTML hasil SSR.
 */
const reveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (binding.value) el.style.setProperty('--d', `${binding.value}ms`)
    getObserver().observe(el)
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) el.style.setProperty('--d', `${binding.value ?? 0}ms`)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
  getSSRProps: () => ({})
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', reveal)
})

