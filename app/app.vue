<template>
  <main class="min-h-screen max-w-[440px] mx-auto bg-brutal-bg text-brutal-dark pb-28 px-4 pt-6 selection:bg-brutal-yellow">
    
    <!-- Top System Bar / Header (Mobile Status Style) -->
    <header class="flex items-center justify-between border-3 border-brutal-dark bg-white p-3 shadow-brutal mb-6">
      <div class="flex items-center gap-2">
        <span class="inline-block w-3 h-3 bg-red-500 rounded-full border-2 border-brutal-dark"></span>
        <span class="inline-block w-3 h-3 bg-yellow-400 rounded-full border-2 border-brutal-dark"></span>
        <span class="inline-block w-3 h-3 bg-green-500 rounded-full border-2 border-brutal-dark"></span>
        <span class="font-mono text-xs font-bold tracking-tight uppercase ml-1">SYSTEM.ONLINE</span>
      </div>
      <div class="font-mono text-xs font-bold bg-brutal-lime px-2 py-0.5 border-2 border-brutal-dark">
        POCO // 393px
      </div>
    </header>

    <!-- Hero Section (Brutalist Badge & Identity) -->
    <section ref="heroSection" class="border-3 border-brutal-dark bg-white p-5 shadow-brutal mb-6 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-28 h-28 bg-brutal-yellow border-3 border-brutal-dark rotate-12 -z-0 opacity-40"></div>
      
      <div class="relative z-10">
        <div class="inline-block bg-brutal-yellow border-2 border-brutal-dark font-mono text-xs font-bold px-2 py-1 mb-3">
          CREATIVE DEVELOPER & BUILDER
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight leading-none mb-2 uppercase">
          AMRU.
        </h1>
        <p class="font-mono text-sm leading-relaxed text-neutral-800 mb-4">
          Building bespoke web systems, authentic mobile experiences, and zero-slop interfaces.
        </p>

        <!-- Quick Status Chips -->
        <div class="grid grid-cols-2 gap-2 font-mono text-xs font-bold">
          <div class="bg-neutral-100 border-2 border-brutal-dark p-2 flex items-center gap-2">
            <span class="w-2 h-2 bg-brutal-lime rounded-full animate-ping"></span>
            OPEN TO WORK
          </div>
          <div class="bg-neutral-100 border-2 border-brutal-dark p-2 text-center">
            ID / GMT+7
          </div>
        </div>
      </div>
    </section>

    <!-- Navigation / Filter Segment (Brutalist Tabs) -->
    <section class="flex gap-2 mb-6 font-mono text-xs font-bold">
      <button 
        @click="activeTab = 'projects'"
        class="flex-1 py-2.5 px-3 border-3 border-brutal-dark transition-all duration-100 text-center uppercase"
        :class="activeTab === 'projects' ? 'bg-brutal-dark text-white shadow-brutal' : 'bg-white text-brutal-dark'"
      >
        WEBSITES [{{ sampleProjects.length }}]
      </button>
      <button 
        @click="activeTab = 'social'"
        class="flex-1 py-2.5 px-3 border-3 border-brutal-dark transition-all duration-100 text-center uppercase"
        :class="activeTab === 'social' ? 'bg-brutal-dark text-white shadow-brutal' : 'bg-white text-brutal-dark'"
      >
        CREATIVE FEED [{{ sampleSocials.length }}]
      </button>
    </section>

    <!-- Tab 1: Projects Showcase -->
    <section v-if="activeTab === 'projects'" class="space-y-5">
      <article 
        v-for="(project, idx) in sampleProjects" 
        :key="project.id"
        class="brutal-card p-4 relative group"
      >
        <div class="flex justify-between items-start gap-2 mb-2">
          <span class="font-mono text-xs font-bold bg-neutral-100 border-2 border-brutal-dark px-2 py-0.5">
            #0{{ idx + 1 }} // {{ project.category }}
          </span>
          <span v-if="project.featured" class="font-mono text-xs font-bold bg-brutal-pink text-white border-2 border-brutal-dark px-2 py-0.5">
            STAR
          </span>
        </div>

        <h3 class="text-xl font-bold uppercase tracking-tight mb-1">
          {{ project.title }}
        </h3>
        <p class="font-mono text-xs text-neutral-700 leading-normal mb-3">
          {{ project.tagline }}
        </p>

        <!-- Tech Stack Tags -->
        <div class="flex flex-wrap gap-1.5 mb-4">
          <span 
            v-for="tech in project.tech_stack" 
            :key="tech"
            class="font-mono text-[10px] font-bold bg-brutal-bg border border-brutal-dark px-1.5 py-0.5"
          >
            {{ tech }}
          </span>
        </div>

        <!-- Action Links -->
        <div class="flex gap-2">
          <a 
            v-if="project.live_url" 
            :href="project.live_url" 
            target="_blank"
            class="brutal-btn flex-1 py-2 text-center text-xs tracking-wider"
          >
            LIVE DEMO ↗
          </a>
          <a 
            v-if="project.github_url" 
            :href="project.github_url" 
            target="_blank"
            class="bg-white border-3 border-brutal-dark font-mono font-bold text-xs p-2 shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5"
          >
            SOURCE
          </a>
        </div>
      </article>
    </section>

    <!-- Tab 2: Curated Social Media Feed (TikTok & IG Sync) -->
    <section v-if="activeTab === 'social'" class="space-y-5">
      <div class="border-2 border-dashed border-brutal-dark p-3 text-center bg-white font-mono text-xs mb-3">
        ⚡ AUTOSYNCED FROM TIKTOK & INSTAGRAM
      </div>

      <article 
        v-for="feed in sampleSocials" 
        :key="feed.id"
        class="brutal-card p-4"
      >
        <div class="flex items-center justify-between mb-2">
          <span 
            class="font-mono text-xs font-bold px-2 py-0.5 border-2 border-brutal-dark uppercase"
            :class="feed.platform === 'tiktok' ? 'bg-black text-white' : 'bg-brutal-pink text-white'"
          >
            {{ feed.platform }}
          </span>
          <span class="font-mono text-[10px] text-neutral-500 font-bold">
            {{ feed.posted_at }}
          </span>
        </div>

        <p class="font-mono text-xs leading-relaxed mb-3">
          {{ feed.caption }}
        </p>

        <a 
          :href="feed.permalink" 
          target="_blank"
          class="inline-block w-full py-2 bg-brutal-cyan border-2 border-brutal-dark text-center font-mono font-bold text-xs shadow-brutal-sm"
        >
          VIEW ON {{ feed.platform.toUpperCase() }} ↗
        </a>
      </article>
    </section>

    <!-- Bottom Mobile Sticky Quick Bar (Thumb-friendly for POCO M6) -->
    <nav class="fixed bottom-3 left-4 right-4 max-w-[408px] mx-auto bg-brutal-yellow border-3 border-brutal-dark shadow-brutal-lg p-2.5 flex items-center justify-between z-50">
      <div class="font-mono text-xs font-bold px-2">
        AMRU.SYSTEMS
      </div>
      <div class="flex gap-2">
        <a 
          href="https://github.com/by-amruu" 
          target="_blank"
          class="bg-white border-2 border-brutal-dark px-3 py-1 font-mono text-xs font-bold shadow-brutal-sm"
        >
          GITHUB
        </a>
        <a 
          href="mailto:amru@example.com" 
          class="bg-brutal-dark text-white border-2 border-brutal-dark px-3 py-1 font-mono text-xs font-bold shadow-brutal-sm"
        >
          CONTACT
        </a>
      </div>
    </nav>

  </main>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('projects')

// Sample data (matches Supabase schema)
const sampleProjects = ref([
  {
    id: '1',
    title: 'Personal Neo-Brutalist Hub',
    tagline: 'High-contrast mobile portfolio with GSAP animations & Supabase data sync.',
    category: 'Portfolio',
    tech_stack: ['Nuxt 3', 'Vue 3', 'Tailwind', 'GSAP', 'Supabase'],
    featured: true,
    live_url: '#',
    github_url: 'https://github.com/by-amruu/website-portofolio-amru'
  },
  {
    id: '2',
    title: 'Minimalist Markdown Engine',
    tagline: 'Zero-slop static note publisher with ultra-clean typographic hierarchy.',
    category: 'Web App',
    tech_stack: ['Vue 3', 'Vite', 'Tailwind CSS'],
    featured: false,
    live_url: '#',
    github_url: '#'
  }
])

const sampleSocials = ref([
  {
    id: '1',
    platform: 'tiktok',
    caption: 'Proses mendesain UI Brutalism yang nyaman di layar HP 120Hz tanpa efek template murahan.',
    posted_at: '2026-11-03',
    permalink: 'https://tiktok.com'
  },
  {
    id: '2',
    platform: 'instagram',
    caption: 'Setup database PostgreSQL & RLS policy untuk portofolio developer modern.',
    posted_at: '2026-11-01',
    permalink: 'https://instagram.com'
  }
])
</script>

