<template>
  <div class="space-y-16">

    <!-- ============================================================= -->
    <!-- 1. HERO SECTION                                               -->
    <!-- ============================================================= -->
    <section class="space-y-5">
      <!-- Status Badge -->
      <div 
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border transition-all duration-300 animate-float-gentle"
        :class="isDaytime 
          ? 'bg-black/[0.04] border-black/[0.08] text-neutral-800' 
          : 'bg-white/[0.04] border-white/[0.08] text-neutral-300'"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Tersedia untuk Project & Kolaborasi</span>
      </div>

      <div class="space-y-3">
        <h1 
          class="text-4xl md:text-6xl font-bold tracking-tight leading-tight transition-colors duration-500"
          :class="isDaytime ? 'text-black' : 'text-white'"
        >
          Amru<span class="text-neutral-500">.</span>
        </h1>
        <p 
          class="text-sm md:text-base leading-relaxed font-normal max-w-2xl transition-colors duration-500"
          :class="isDaytime ? 'text-neutral-600' : 'text-neutral-300'"
        >
          Koleksi karya website, eksplorasi desain kemasan, edukasi grafis, dan proyek kreatif lintas platform (Web, Instagram, TikTok & Pinterest).
        </p>
      </div>

      <!-- Quick Platform Filter Pills -->
      <div class="flex flex-wrap items-center gap-2 pt-2 text-xs">
        <button 
          @click="activeFilter = 'all'"
          class="px-4 py-1.5 rounded-full border transition-all duration-300 cursor-pointer transform hover:scale-105"
          :class="getFilterButtonClass('all')"
        >
          Semua ({{ items.length }})
        </button>
        <button 
          v-for="plat in availablePlatforms" 
          :key="plat"
          @click="activeFilter = plat"
          class="px-4 py-1.5 rounded-full border capitalize transition-all duration-300 cursor-pointer transform hover:scale-105"
          :class="getFilterButtonClass(plat)"
        >
          {{ plat }} ({{ items.filter(i => i.platform === plat).length }})
        </button>
      </div>
    </section>

    <!-- ============================================================= -->
    <!-- 2. UNIVERSAL BENTO GRID (RESPONSIF & ANIMATED)                -->
    <!-- ============================================================= -->
    <section id="portfolio" class="space-y-6">
      
      <!-- Empty State -->
      <div v-if="filteredItems.length === 0" class="premium-card p-12 rounded-2xl text-center space-y-3">
        <p 
          class="text-sm font-medium transition-colors"
          :class="isDaytime ? 'text-neutral-700' : 'text-neutral-300'"
        >
          Belum ada karya yang ditampilkan di kategori ini.
        </p>
        <p 
          class="text-xs transition-colors"
          :class="isDaytime ? 'text-neutral-500' : 'text-neutral-500'"
        >
          Karya portofolio akan segera diperbarui.
        </p>
      </div>

      <!-- Grid Bento Flexibel: 16:9 span 2 kolom, 3:4/9:16 span 1 kolom -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        <article 
          v-for="(item, idx) in filteredItems" 
          :key="item.id"
          class="premium-card rounded-2xl overflow-hidden group flex flex-col justify-between transition-all duration-500 hover:shadow-2xl"
          :class="getCardSpanClass(item.aspect_ratio)"
        >
          <!-- Top Card Meta Bar -->
          <div 
            class="p-3.5 flex items-center justify-between border-b transition-colors duration-500"
            :class="isDaytime ? 'border-black/[0.06] bg-black/[0.02]' : 'border-white/[0.06] bg-[#121212]'"
          >
            <div class="flex items-center gap-2">
              <span 
                class="font-mono uppercase font-bold px-2 py-0.5 rounded text-[10px] transition-transform duration-300 group-hover:scale-105"
                :class="getPlatformBadgeClass(item.platform)"
              >
                {{ item.platform }}
              </span>
              <span 
                class="text-[11px] truncate max-w-[120px]"
                :class="isDaytime ? 'text-neutral-600 font-medium' : 'text-neutral-400'"
              >
                {{ item.category || 'Karya' }}
              </span>
            </div>

            <a 
              v-if="item.live_url" 
              :href="item.live_url" 
              target="_blank"
              class="text-[11px] flex items-center gap-1 font-mono transition-all duration-300 hover:translate-x-0.5"
              :class="isDaytime ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'"
            >
              Buka ↗
            </a>
          </div>

          <!-- MEDIA PREVIEW CONTAINER (Zoom Micro-interaction & Shimmer Gradient) -->
          <div 
            class="relative w-full bg-black overflow-hidden flex items-center justify-center"
            :class="getAspectClass(item.aspect_ratio)"
          >
            <img 
              :src="item.preview_url" 
              class="w-full h-full object-cover transform scale-100 group-hover:scale-108 transition-all duration-700 ease-out will-change-transform"
              alt="Preview Karya"
              loading="lazy"
            />

            <!-- Ambient Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
            
            <!-- Card Title (Always Crisp on Top of Image) -->
            <div class="absolute bottom-3 left-3 right-3 z-10 transition-transform duration-300 group-hover:-translate-y-1">
              <h3 class="text-sm font-bold text-white leading-snug drop-shadow-md line-clamp-2">
                {{ item.title }}
              </h3>
            </div>
          </div>

          <!-- Bottom Description & Details -->
          <div 
            class="p-4 space-y-3 border-t flex-1 flex flex-col justify-between transition-colors duration-500"
            :class="isDaytime ? 'bg-white/60 border-black/[0.06]' : 'bg-[#111111] border-white/[0.06]'"
          >
            <p 
              v-if="item.description" 
              class="text-xs leading-relaxed line-clamp-2 transition-colors"
              :class="isDaytime ? 'text-neutral-700' : 'text-neutral-300'"
            >
              {{ item.description }}
            </p>

            <div v-if="item.tech_stack && item.tech_stack.length > 0" class="flex flex-wrap gap-1.5 pt-1">
              <span 
                v-for="tag in item.tech_stack" 
                :key="tag"
                class="text-[10px] px-2 py-0.5 rounded-md border font-mono transition-all duration-300"
                :class="isDaytime 
                  ? 'bg-black/[0.04] border-black/[0.08] text-neutral-700 hover:bg-black/[0.08]' 
                  : 'bg-white/[0.05] border-white/[0.1] text-neutral-300 hover:bg-white/[0.1]'"
              >
                {{ tag }}
              </span>
            </div>

            <div 
              class="flex items-center justify-between pt-2 border-t text-xs transition-colors"
              :class="isDaytime ? 'border-black/[0.06]' : 'border-white/[0.04]'"
            >
              <a 
                v-if="item.live_url" 
                :href="item.live_url" 
                target="_blank"
                class="font-medium inline-flex items-center gap-1 transition-all duration-300 hover:translate-x-1"
                :class="isDaytime ? 'text-neutral-900 hover:text-blue-600' : 'text-white hover:text-neutral-200'"
              >
                Lihat Karya ↗
              </a>
              <span class="text-[10px] font-mono text-neutral-500">
                Rasio {{ item.aspect_ratio || '3:4' }}
              </span>
            </div>
          </div>
        </article>
      </div>

    </section>

    <!-- ============================================================= -->
    <!-- 3. CONTACT FOOTER                                             -->
    <!-- ============================================================= -->
    <section 
      id="contact" 
      class="premium-card p-8 md:p-12 rounded-3xl text-center space-y-4 max-w-3xl mx-auto transition-all duration-500"
    >
      <h3 
        class="text-2xl font-bold tracking-tight transition-colors duration-500"
        :class="isDaytime ? 'text-black' : 'text-white'"
      >
        Tertarik Berkolaborasi?
      </h3>
      <p 
        class="text-xs md:text-sm max-w-md mx-auto leading-relaxed transition-colors duration-500"
        :class="isDaytime ? 'text-neutral-600' : 'text-neutral-400'"
      >
        Punya ide website, butuh aset desain visual, atau ingin berdiskusi santai? Hubungi saya kapan saja.
      </p>
      <div class="pt-2 flex justify-center gap-3">
        <a 
          href="mailto:amru@example.com" 
          class="px-6 py-2.5 rounded-lg font-semibold text-xs transition-all duration-300 transform hover:scale-105"
          :class="isDaytime ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'"
        >
          Kirim Email
        </a>
        <a 
          href="https://www.tiktok.com/@by.amruu" 
          target="_blank" 
          class="px-6 py-2.5 rounded-lg border text-xs transition-all duration-300 transform hover:scale-105"
          :class="isDaytime 
            ? 'bg-black/[0.04] border-black/[0.08] text-neutral-800 hover:bg-black/[0.08]' 
            : 'bg-white/[0.05] border-white/[0.08] text-neutral-300 hover:bg-white/[0.1]'"
        >
          TikTok ↗
        </a>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  isDaytime: {
    type: Boolean,
    default: false
  }
})

const items = ref([])
const activeFilter = ref('all')

const { $supabase } = useNuxtApp()

const availablePlatforms = computed(() => {
  const set = new Set(items.value.map(i => i.platform))
  return Array.from(set).filter(Boolean)
})

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return items.value
  return items.value.filter(i => i.platform === activeFilter.value)
})

const getFilterButtonClass = (plat) => {
  const isSelected = activeFilter.value === plat
  if (props.isDaytime) {
    return isSelected
      ? 'bg-black text-white font-semibold border-black shadow-md'
      : 'bg-black/[0.03] text-neutral-600 border-black/[0.08] hover:text-black hover:bg-black/[0.06]'
  } else {
    return isSelected
      ? 'bg-white text-black font-semibold border-white shadow-md'
      : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:text-white hover:bg-white/[0.08]'
  }
}

const getAspectClass = (ratio) => {
  if (ratio === '16:9') return 'aspect-[16/9]'
  if (ratio === '9:16') return 'aspect-[9/16]'
  return 'aspect-[3/4]'
}

const getCardSpanClass = (ratio) => {
  if (ratio === '16:9') {
    return 'sm:col-span-2'
  }
  return 'col-span-1'
}

const getPlatformBadgeClass = (plat) => {
  switch (plat) {
    case 'tiktok': return 'bg-black text-white border border-white/20'
    case 'instagram': return 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
    case 'pinterest': return 'bg-red-700 text-white'
    case 'website': return 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/30'
    default: return 'bg-white/10 text-white'
  }
}

onMounted(async () => {
  if (!$supabase) return

  try {
    const { data, error } = await $supabase
      .from('portfolio_items')
      .select('*')
      .order('order_priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (!error && data) {
      items.value = data
    }
  } catch (err) {
    console.warn('[Fetch portfolio_items error]', err)
  }
})
</script>
