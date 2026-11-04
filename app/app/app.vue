<template>
  <div 
    class="relative min-h-screen antialiased selection:bg-black selection:text-white transition-colors duration-1000 overflow-hidden"
    :class="isDaytime ? 'theme-light text-neutral-900' : 'theme-dark text-[#FAFAFA]'"
    :style="{ backgroundColor: currentBgColor }"
    @mousemove="handleMouseMove"
  >
    <!-- ============================================================= -->
    <!-- DYNAMIC REAL-TIME DAY/NIGHT & MASSIVE KINETIC BACKGROUND       -->
    <!-- ============================================================= -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      
      <!-- 1. Real-Time Atmospheric Sky Gradients -->
      <div 
        class="absolute inset-0 transition-opacity duration-1000"
        :style="{ background: currentSkyGradient }"
      ></div>

      <!-- 2. Massive Atmospheric Aurora Glowing Waves (Fluid & Floating) -->
      <div 
        class="absolute -top-36 -left-32 w-[720px] h-[720px] rounded-full blur-[85px] animate-aurora-1 transition-all duration-1000"
        :style="{ background: orbColor1, opacity: isDaytime ? 0.35 : 0.45 }"
      ></div>
      <div 
        class="absolute top-1/4 -right-36 w-[680px] h-[680px] rounded-full blur-[95px] animate-aurora-2 transition-all duration-1000"
        :style="{ background: orbColor2, opacity: isDaytime ? 0.30 : 0.40 }"
      ></div>
      <div 
        class="absolute -bottom-36 left-1/4 w-[820px] h-[820px] rounded-full blur-[105px] animate-aurora-3 transition-all duration-1000"
        :style="{ background: orbColor3, opacity: isDaytime ? 0.25 : 0.35 }"
      ></div>

      <!-- 3. Top Ambient Horizon Glow -->
      <div 
        class="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] rounded-full transition-opacity duration-1000"
        :style="{ 
          background: isDaytime 
            ? 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.9) 0%, rgba(240, 249, 255, 0.4) 50%, transparent 100%)' 
            : 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 100%)',
          opacity: 0.7 
        }"
      ></div>

      <!-- 4. Interactive Cursor Spotlight (Desktop Only) -->
      <div 
        ref="spotlightRef"
        class="hidden md:block absolute inset-0 transition-opacity duration-300"
        :style="{
          background: isDaytime
            ? 'radial-gradient(650px circle at var(--mouse-x, 50vw) var(--mouse-y, 30vh), rgba(59, 130, 246, 0.08), transparent 50%)'
            : 'radial-gradient(650px circle at var(--mouse-x, 50vw) var(--mouse-y, 30vh), rgba(255, 255, 255, 0.045), transparent 50%)'
        }"
      ></div>

      <!-- 5. Floating Firefly & Starlight Particle Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-[16%] left-[20%] w-2 h-2 rounded-full animate-particle-1" :class="isDaytime ? 'bg-sky-400 shadow-[0_0_10px_#38bdf8]' : 'bg-cyan-300 shadow-[0_0_10px_#67e8f9]'"></div>
        <div class="absolute top-[32%] left-[80%] w-2.5 h-2.5 rounded-full animate-particle-2" :class="isDaytime ? 'bg-amber-400 shadow-[0_0_12px_#f59e0b]' : 'bg-indigo-300 shadow-[0_0_12px_#a5b4fc]'"></div>
        <div class="absolute top-[62%] left-[14%] w-1.5 h-1.5 rounded-full animate-particle-3" :class="isDaytime ? 'bg-rose-400 shadow-[0_0_10px_#fb7185]' : 'bg-amber-200 shadow-[0_0_10px_#fde68a]'"></div>
        <div class="absolute top-[78%] left-[70%] w-2 h-2 rounded-full animate-particle-4" :class="isDaytime ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-emerald-300 shadow-[0_0_10px_#6ee7b7]'"></div>
        <div class="absolute top-[24%] left-[58%] w-1.5 h-1.5 rounded-full animate-particle-5" :class="isDaytime ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 'bg-white shadow-[0_0_8px_#ffffff]'"></div>
      </div>

      <!-- 6. Architectural Grid with Dynamic Beams -->
      <div class="absolute inset-0 bg-architectural-grid">
        <!-- 3 Vertical Laser Beams -->
        <div class="absolute left-[16%] top-0 w-[1.5px] h-60 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-laser-v-1"></div>
        <div class="absolute left-[50%] top-0 w-[1px] h-72 bg-gradient-to-b from-transparent via-white/80 to-transparent animate-laser-v-2"></div>
        <div class="absolute left-[84%] top-0 w-[1.5px] h-64 bg-gradient-to-b from-transparent via-indigo-400 to-transparent animate-laser-v-3"></div>
        
        <!-- 2 Horizontal Stream Beams -->
        <div class="absolute top-[200px] left-0 h-[1.5px] w-72 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent animate-laser-h-1"></div>
        <div class="absolute top-[580px] left-0 h-[1px] w-96 bg-gradient-to-r from-transparent via-purple-400/80 to-transparent animate-laser-h-2"></div>
      </div>

    </div>

    <!-- ============================================================= -->
    <!-- TOP FLOATING NAVBAR                                           -->
    <!-- ============================================================= -->
    <header 
      class="sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-500"
      :class="isDaytime ? 'bg-white/80 border-black/[0.08]' : 'bg-[#050505]/80 border-white/[0.08]'"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <!-- Brand Link -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div 
            class="w-8 h-8 rounded-full overflow-hidden border transition-all duration-300 group-hover:scale-105"
            :class="isDaytime ? 'border-black/20 bg-neutral-100 group-hover:border-black' : 'border-white/20 bg-black group-hover:border-white'"
          >
            <img src="/favicon.png" alt="Amru Icon" class="w-full h-full object-cover" />
          </div>
          <span 
            class="font-semibold text-sm tracking-tight transition-colors"
            :class="isDaytime ? 'text-neutral-900 group-hover:text-black' : 'text-neutral-200 group-hover:text-white'"
          >
            by.amruu
          </span>
        </NuxtLink>

        <!-- Time & Day/Night Indicator Badge (Real-Time Synchronized) -->
        <div 
          class="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border transition-all duration-500"
          :class="isDaytime ? 'bg-black/[0.04] border-black/[0.08] text-neutral-700' : 'bg-white/[0.05] border-white/[0.1] text-neutral-300'"
        >
          <span class="w-2 h-2 rounded-full animate-ping" :class="timeStatusDot"></span>
          <span>{{ isDaytime ? '☀️ Terang' : '🌙 Gelap' }} • {{ timeStatusLabel }} ({{ localClock }})</span>
        </div>

        <!-- Clean Navigation Links -->
        <nav 
          class="flex items-center gap-6 text-xs font-medium"
          :class="isDaytime ? 'text-neutral-600' : 'text-neutral-400'"
        >
          <button 
            @click="scrollToSection('portfolio')" 
            class="transition-colors cursor-pointer"
            :class="isDaytime ? 'hover:text-black' : 'hover:text-white'"
          >
            Portofolio
          </button>
          <button 
            @click="scrollToSection('contact')" 
            class="transition-colors cursor-pointer"
            :class="isDaytime ? 'hover:text-black' : 'hover:text-white'"
          >
            Kontak
          </button>
          <a 
            href="https://github.com/by-amruu" 
            target="_blank" 
            class="px-3.5 py-1.5 rounded-full transition-all duration-300 transform hover:scale-105"
            :class="isDaytime ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white/10 text-white hover:bg-white hover:text-black'"
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>

    <!-- ============================================================= -->
    <!-- MAIN CONTAINER                                                -->
    <!-- ============================================================= -->
    <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <NuxtPage :is-daytime="isDaytime" />
    </main>

    <!-- ============================================================= -->
    <!-- FOOTER                                                        -->
    <!-- ============================================================= -->
    <footer 
      class="relative z-10 border-t py-8 text-center text-xs transition-colors duration-500"
      :class="isDaytime ? 'border-black/[0.08] text-neutral-500' : 'border-white/[0.06] text-neutral-400'"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <img src="/favicon.png" alt="Amru Logo" class="w-4 h-4 rounded-full" />
          <p>© 2026 by.amruu. Seluruh hak cipta dilindungi.</p>
        </div>
        <p class="font-mono text-[11px]" :class="isDaytime ? 'text-neutral-400' : 'text-neutral-500'">
          Bespoke Web & Visual Systems
        </p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const router = useRouter()
const route = useRoute()
const spotlightRef = ref(null)

// Zero-overhead cursor spotlight update via native CSS variables
const handleMouseMove = (e) => {
  if (!spotlightRef.value) return
  spotlightRef.value.style.setProperty('--mouse-x', `${e.clientX}px`)
  spotlightRef.value.style.setProperty('--mouse-y', `${e.clientY}px`)
}

// -------------------------------------------------------------
// REAL-TIME DAY/NIGHT & ATMOSPHERIC ENGINE
// Siang (Pagi s.d Sore): 05:30 - 17:59 -> Mode Terang Putih Elegan
// Malam (Magrib s.d Subuh): 18:00 - 05:29 -> Mode Gelap Luxury Minimalist
// -------------------------------------------------------------
const currentHour = ref(new Date().getHours())
const currentMinute = ref(new Date().getMinutes())
let clockTimer = null

const updateClock = () => {
  const now = new Date()
  currentHour.value = now.getHours()
  currentMinute.value = now.getMinutes()
}

const localClock = computed(() => {
  const h = String(currentHour.value).padStart(2, '0')
  const m = String(currentMinute.value).padStart(2, '0')
  return `${h}:${m}`
})

// Apakah sekarang jam pagi - sore (05:30 s.d 17:59)?
const isDaytime = computed(() => {
  const totalMinutes = currentHour.value * 60 + currentMinute.value
  const morningStart = 5 * 60 + 30 // 05:30
  const magribStart = 18 * 60     // 18:00
  return totalMinutes >= morningStart && totalMinutes < magribStart
})

// Fase detail untuk pewarnaan langit
const timeStatusLabel = computed(() => {
  const h = currentHour.value
  if (h >= 5 && h < 11) return 'Pagi Cerah'
  if (h >= 11 && h < 15) return 'Siang Benderang'
  if (h >= 15 && h < 18) return 'Sore Santai'
  if (h >= 18 && h < 20) return 'Magrib & Senja'
  return 'Malam Tenang'
})

const timeStatusDot = computed(() => {
  return isDaytime.value ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-indigo-400 shadow-[0_0_8px_#818cf8]'
})

// Base background color
const currentBgColor = computed(() => {
  if (isDaytime.value) {
    const h = currentHour.value
    if (h >= 15 && h < 18) return '#FAF8F5' // warm golden daylight
    return '#F8FAFC' // crisp clean white slate daylight
  } else {
    const h = currentHour.value
    if (h >= 18 && h < 20) return '#0d0914' // sunset twilight velvet
    return '#050508' // midnight clean obsidian
  }
})

// Atmospheric Sky Radial Gradients
const currentSkyGradient = computed(() => {
  if (isDaytime.value) {
    return 'radial-gradient(ellipse at 50% -10%, rgba(56, 189, 248, 0.20) 0%, rgba(240, 249, 255, 0.6) 40%, transparent 80%)'
  } else {
    return 'radial-gradient(ellipse at 50% -10%, rgba(99, 102, 241, 0.16) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 80%)'
  }
})

// Aurora Orbs Colors (Day vs Night)
const orbColor1 = computed(() => {
  if (isDaytime.value) {
    return 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)'
  }
  return 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)'
})

const orbColor2 = computed(() => {
  if (isDaytime.value) {
    return 'radial-gradient(circle, rgba(251, 146, 60, 0.30) 0%, transparent 70%)'
  }
  return 'radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, transparent 70%)'
})

const orbColor3 = computed(() => {
  if (isDaytime.value) {
    return 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)'
  }
  return 'radial-gradient(circle, rgba(56, 189, 248, 0.20) 0%, transparent 70%)'
})

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 30000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})

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
