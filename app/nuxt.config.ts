import { defineNuxtConfig } from 'nuxt/config'

// Dijalankan sebelum halaman pertama dicat: memasang tema (terang 05.30-17.59,
// gelap setelahnya, atau pilihan manual dari localStorage) dan menandai JS aktif
// agar animasi reveal tidak berkedip. Harus sinkron & tanpa dependensi.
const themeBootstrap = `(function(){var d=document.documentElement;d.classList.add('js');var t='dark';try{var m=localStorage.getItem('theme-mode')||'auto';if(m==='light'||m==='dark'){t=m}else{var n=new Date(),x=n.getHours()*60+n.getMinutes();t=(x>=330&&x<1080)?'light':'dark'}}catch(e){}d.dataset.theme=t})();`

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  nitro: {
    preset: 'static'
  },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'by.amruu | Portfolio & Creative Works',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Koleksi karya website, desain kemasan, edukasi grafis, dan proyek kreatif lintas platform oleh by.amruu.' },
        { name: 'theme-color', content: '#0b0b0c' },
        { name: 'p:domain_verify', content: 'ee86de96c70a3ebc11b6cda953ee946d' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'by.amruu | Portfolio & Creative Works' },
        { property: 'og:description', content: 'Koleksi karya website, desain kemasan, edukasi grafis, dan proyek kreatif lintas platform.' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Inter:wght@400;500;600&display=swap'
        }
      ],
      script: [{ innerHTML: themeBootstrap, tagPosition: 'head' }]
    }
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
      // Opsional. Kalau kosong, tombol kontak utama memakai DM Instagram.
      contactEmail: process.env.CONTACT_EMAIL || ''
    }
  }
})
