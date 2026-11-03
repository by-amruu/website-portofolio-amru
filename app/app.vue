<template>
  <div class="min-h-screen bg-[#050505] text-[#FAFAFA] antialiased selection:bg-white selection:text-black">
    
    <!-- Top Floating Navbar -->
    <header class="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2.5 group">
          <div class="w-7 h-7 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-xs tracking-tighter">
            A
          </div>
          <span class="font-medium text-sm text-neutral-200 group-hover:text-white transition-colors">
            amru.dev
          </span>
        </NuxtLink>

        <!-- Clean Navigation Links -->
        <nav class="flex items-center gap-4 text-xs text-neutral-400">
          <a href="/#projects" class="hover:text-white transition-colors">Karya</a>
          <a href="/#content" class="hover:text-white transition-colors">Konten</a>
          <a href="/#contact" class="hover:text-white transition-colors">Kontak</a>
          <a 
            href="https://github.com/by-amruu" 
            target="_blank" 
            class="px-2.5 py-1 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all"
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>

    <!-- Nuxt Page View Slot -->
    <main class="max-w-2xl mx-auto px-4 py-12 md:py-16">
      <NuxtPage />
    </main>

    <!-- Bottom Simple Footer -->
    <footer class="border-t border-white/[0.06] py-8 text-center text-xs text-neutral-400">
      <div class="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 Amru. Seluruh hak cipta dilindungi.</p>
        <NuxtLink to="/admin" class="hover:text-neutral-400 transition-colors">
          Admin Portal
        </NuxtLink>
      </div>
    </footer>

  </div>
</template>
