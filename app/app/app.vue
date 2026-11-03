<template>
  <div 
    class="relative min-h-screen bg-[#050505] text-[#FAFAFA] antialiased selection:bg-white selection:text-black overflow-hidden"
    @mousemove="handleMouseMove"
  >
    <!-- DYNAMIC LUXURY ARCHITECTURAL BACKGROUND (GPU Accelerated & Ultra-Light) -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <!-- 1. Top Ambient Studio Light -->
      <div 
        class="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[380px] rounded-full opacity-60"
        style="background: radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0) 100%);"
      ></div>

      <!-- 2. Interactive Cursor Spotlight (Desktop Only, Zero Re-render via CSS Vars) -->
      <div 
        ref="spotlightRef"
        class="hidden md:block absolute inset-0 transition-opacity duration-500"
        style="background: radial-gradient(650px circle at var(--mouse-x, 50vw) var(--mouse-y, 30vh), rgba(255, 255, 255, 0.035), transparent 45%);"
      ></div>

      <!-- 3. Precision Architectural Grid -->
      <div class="absolute inset-0 bg-architectural-grid">
        <!-- Animated Light Beams along grid lines -->
        <div class="absolute left-[18%] top-0 w-[1px] h-44 bg-gradient-to-b from-transparent via-white/25 to-transparent animate-beam-v-1"></div>
        <div class="absolute left-[78%] top-0 w-[1px] h-56 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-beam-v-2"></div>
        <div class="absolute top-[256px] left-0 h-[1px] w-52 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-beam-h-1"></div>
      </div>
    </div>

    <!-- Top Floating Navbar: Lebar & Lega (max-w-7xl) -->
    <header class="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <!-- Custom Icon dari .gallery/icon-websiteku.png -->
          <div class="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-black flex items-center justify-center group-hover:border-white transition-colors">
            <img src="/favicon.png" alt="Amru Icon" class="w-full h-full object-cover" />
          </div>
          <span class="font-medium text-sm text-neutral-200 group-hover:text-white transition-colors">
            by.amruu
          </span>
        </NuxtLink>

        <!-- Clean Navigation Links: Smooth Scroll tanpa meninggalkan hash kotor di URL -->
        <nav class="flex items-center gap-6 text-xs text-neutral-400">
          <button @click="scrollToSection('portfolio')" class="hover:text-white transition-colors cursor-pointer">
            Portofolio
          </button>
          <button @click="scrollToSection('contact')" class="hover:text-white transition-colors cursor-pointer">
            Kontak
          </button>
          <a 
            href="https://github.com/by-amruu" 
            target="_blank" 
            class="px-3.5 py-1.5 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all"
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>

    <!-- Main Container Lebar & Lega -->
    <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <NuxtPage />
    </main>

    <!-- Bottom Simple Footer -->
    <footer class="relative z-10 border-t border-white/[0.06] py-8 text-center text-xs text-neutral-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <img src="/favicon.png" alt="Amru Logo" class="w-4 h-4 rounded-full" />
          <p>© 2026 by.amruu. Seluruh hak cipta dilindungi.</p>
        </div>
        <p class="text-neutral-500 font-mono text-[11px]">Bespoke Web & Visual Systems</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()
const spotlightRef = ref(null)

// Zero-overhead cursor spotlight update via native CSS variables
const handleMouseMove = (e) => {
  if (!spotlightRef.value) return
  spotlightRef.value.style.setProperty('--mouse-x', `${e.clientX}px`)
  spotlightRef.value.style.setProperty('--mouse-y', `${e.clientY}px`)
}

const scrollToSection = (id) => {
  if (route.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    })
    return
  }

  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    if (window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }
}
</script>
