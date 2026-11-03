<template>
  <div class="space-y-16">

    <!-- 1. HERO SECTION -->
    <section class="space-y-5">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-300">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        Tersedia untuk Project & Kolaborasi
      </div>

      <div class="space-y-3">
        <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Amru<span class="text-neutral-500">.</span>
        </h1>
        <p class="text-sm md:text-base text-neutral-300 leading-relaxed font-normal max-w-2xl">
          Koleksi karya website, eksplorasi desain kemasan, edukasi grafis, dan proyek kreatif lintas platform (Web, Instagram, TikTok & Pinterest).
        </p>
      </div>

      <!-- Quick Platform Filter Pills -->
      <div class="flex flex-wrap items-center gap-2 pt-2 text-xs">
        <button 
          @click="activeFilter = 'all'"
          class="px-4 py-1.5 rounded-full border transition-all"
          :class="activeFilter === 'all' ? 'bg-white text-black font-semibold border-white' : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:text-white'"
        >
          Semua ({{ items.length }})
        </button>
        <button 
          v-for="plat in availablePlatforms" 
          :key="plat"
          @click="activeFilter = plat"
          class="px-4 py-1.5 rounded-full border capitalize transition-all"
          :class="activeFilter === plat ? 'bg-white text-black font-semibold border-white' : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:text-white'"
        >
          {{ plat }} ({{ items.filter(i => i.platform === plat).length }})
        </button>
      </div>
    </section>

    <!-- 2. TRUE BENTO GRID -->
    <section id="portfolio" class="space-y-6">
      
      <!-- Empty State -->
      <div v-if="filteredItems.length === 0" class="premium-card p-12 rounded-2xl text-center space-y-3">
        <p class="text-sm text-neutral-300 font-medium">Belum ada karya yang ditampilkan di kategori ini.</p>
        <p class="text-xs text-neutral-500">
          Karya portofolio akan segera diperbarui.
        </p>
      </div>

      <!-- Grid Bento Lebar -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        <article 
          v-for="item in filteredItems" 
          :key="item.id"
          class="premium-card rounded-2xl overflow-hidden group flex flex-col justify-between border border-white/[0.08] bg-[#0E0E0E] transition-all duration-300"
          :class="getCardSpanClass(item.aspect_ratio)"
        >
          <!-- Top Card Meta Bar -->
          <div class="p-3.5 flex items-center justify-between border-b border-white/[0.06] bg-[#121212]">
            <div class="flex items-center gap-2">
              <span 
                class="font-mono uppercase font-bold px-2 py-0.5 rounded text-[10px]"
                :class="getPlatformBadgeClass(item.platform)"
              >
                {{ item.platform }}
              </span>
              <span class="text-[11px] text-neutral-400 truncate max-w-[120px]">
                {{ item.category || 'Karya' }}
              </span>
            </div>

            <a 
              v-if="item.live_url" 
              :href="item.live_url" 
              target="_blank"
              class="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
            >
              Buka ↗
            </a>
          </div>

          <!-- MEDIA PREVIEW CONTAINER -->
          <div 
            class="relative w-full bg-black overflow-hidden flex items-center justify-center"
            :class="getAspectClass(item.aspect_ratio)"
          >
            <img 
              :src="item.preview_url" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Preview Karya"
              loading="lazy"
            />

            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
            
            <div class="absolute bottom-3 left-3 right-3 z-10">
              <h3 class="text-sm font-bold text-white leading-snug drop-shadow-md line-clamp-2">
                {{ item.title }}
              </h3>
            </div>
          </div>

          <!-- Bottom Description & Details -->
          <div class="p-4 space-y-3 bg-[#111111] border-t border-white/[0.06] flex-1 flex flex-col justify-between">
            <p v-if="item.description" class="text-xs text-neutral-300 leading-relaxed line-clamp-2">
              {{ item.description }}
            </p>

            <div v-if="item.tech_stack && item.tech_stack.length > 0" class="flex flex-wrap gap-1.5 pt-1">
              <span 
                v-for="tag in item.tech_stack" 
                :key="tag"
                class="premium-pill text-[10px] px-2 py-0.5 rounded-md"
              >
                {{ tag }}
              </span>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-white/[0.04] text-xs">
              <a 
                v-if="item.live_url" 
                :href="item.live_url" 
                target="_blank"
                class="text-white font-medium hover:underline inline-flex items-center gap-1"
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

    <!-- 3. CONTACT FOOTER -->
    <section id="contact" class="premium-card p-8 md:p-12 rounded-3xl text-center space-y-4 max-w-3xl mx-auto">
      <h3 class="text-2xl font-bold text-white tracking-tight">Tertarik Berkolaborasi?</h3>
      <p class="text-xs md:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
        Punya ide website, butuh aset desain visual, atau ingin berdiskusi santai? Hubungi saya kapan saja.
      </p>
      <div class="pt-2 flex justify-center gap-3">
        <a 
          href="mailto:amru@example.com" 
          class="px-6 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
        >
          Kirim Email
        </a>
        <a 
          href="https://www.tiktok.com/@by.amruu" 
          target="_blank" 
          class="px-6 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs text-neutral-300 transition-colors"
        >
          TikTok ↗
        </a>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

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
    case 'website': return 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
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
