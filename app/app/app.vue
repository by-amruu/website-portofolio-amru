<template>
  <div class="min-h-screen bg-[#050505] text-[#FAFAFA] antialiased selection:bg-white selection:text-black">
    
    <!-- Top Floating Navbar: Lebar & Lega (max-w-7xl) -->
    <header class="sticky top-0 z-40 bg-[#050505]/85 backdrop-blur-xl border-b border-white/[0.06]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <!-- Custom Icon dari .gallery/icon-websiteku.png -->
          <div class="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-black flex items-center justify-center group-hover:border-white transition-colors">
            <img src="/favicon.png" alt="Amru Icon" class="w-full h-full object-cover" />
          </div>
          <span class="font-medium text-sm text-neutral-200 group-hover:text-white transition-colors">
            amru.dev
          </span>
        </NuxtLink>

        <!-- Clean Navigation Links -->
        <nav class="flex items-center gap-6 text-xs text-neutral-400">
          <a href="/#portfolio" class="hover:text-white transition-colors">Portofolio</a>
          <a href="/#contact" class="hover:text-white transition-colors">Kontak</a>
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
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <NuxtPage />
    </main>

    <!-- Bottom Simple Footer -->
    <footer class="border-t border-white/[0.06] py-8 text-center text-xs text-neutral-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <img src="/favicon.png" alt="Amru Logo" class="w-4 h-4 rounded-full" />
          <p>© 2026 Amru. Seluruh hak cipta dilindungi.</p>
        </div>
        <p class="text-neutral-500 font-mono text-[11px]">Bespoke Web & Visual Systems</p>
      </div>
    </footer>

  </div>
</template>
