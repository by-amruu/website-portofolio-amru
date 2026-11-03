<template>
  <div class="space-y-10 max-w-4xl mx-auto pb-20 relative">
    
    <!-- 🔔 FLOATING TOAST NOTIFICATION MODAL -->
    <transition name="toast">
      <div 
        v-if="toast.show" 
        class="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md"
        :class="toast.type === 'error' ? 'bg-red-950/90 border-red-500/40 text-red-200' : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'"
      >
        <span class="text-sm">{{ toast.type === 'error' ? '⚠️' : '✓' }}</span>
        <p class="text-xs font-medium">{{ toast.message }}</p>
        <button @click="toast.show = false" class="text-neutral-400 hover:text-white text-xs ml-2">✕</button>
      </div>
    </transition>

    <!-- ⚠️ CONFIRMATION POPUP MODAL (GANTI BROWSER ALERT / CONFIRM) -->
    <div 
      v-if="confirmModal.show" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
      @click.self="confirmModal.show = false"
    >
      <div class="bg-[#141414] border border-white/[0.1] rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
        <div class="space-y-1.5">
          <div class="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-lg mb-2">
            🗑️
          </div>
          <h3 class="text-sm font-bold text-white">{{ confirmModal.title }}</h3>
          <p class="text-xs text-neutral-400 leading-relaxed">{{ confirmModal.message }}</p>
        </div>

        <div class="flex gap-2 pt-2">
          <button 
            @click="confirmModal.show = false" 
            class="flex-1 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs text-neutral-300 font-medium transition-colors"
          >
            Batal
          </button>
          <button 
            @click="executeConfirmedAction" 
            :disabled="confirmModal.loading"
            class="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs text-white font-semibold transition-colors disabled:opacity-50"
          >
            {{ confirmModal.loading ? 'Menghapus...' : 'Ya, Hapus Data' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Header Admin -->
    <div class="flex items-center justify-between border-b border-white/[0.08] pb-4">
      <div>
        <h1 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>🛡️</span> Amru Admin Console
        </h1>
        <p class="text-xs text-neutral-400">
          Kelola CRUD Karya Website & Feed Media Sosial secara langsung.
        </p>
      </div>
      <div v-if="isAuthenticated" class="flex items-center gap-3">
        <span class="text-xs text-emerald-400 font-mono">● Sesi Aktif</span>
        <button 
          @click="logout" 
          class="text-xs text-neutral-400 hover:text-red-400 px-3 py-1 rounded bg-white/[0.05] transition-colors"
        >
          Keluar
        </button>
      </div>
    </div>

    <!-- STATE 1: FORM LOGIN -->
    <div v-if="!isAuthenticated" class="max-w-sm mx-auto p-6 rounded-2xl bg-[#111111] border border-white/[0.08] space-y-4">
      <div class="space-y-1">
        <h2 class="text-sm font-semibold text-white">Login Admin</h2>
        <p class="text-xs text-neutral-400">Masukkan kata sandi pribadi Anda:</p>
      </div>
      <input 
        v-model="passwordInput"
        type="password"
        placeholder="Kata sandi..."
        class="w-full px-3.5 py-2.5 rounded-lg bg-black border border-white/[0.1] text-white text-xs focus:outline-none focus:border-white transition-colors"
        @keyup.enter="handleLogin"
      />
      <button 
        @click="handleLogin"
        class="w-full py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
      >
        Buka Console
      </button>
      <p v-if="loginError" class="text-red-400 text-xs text-center">
        {{ loginError }}
      </p>
    </div>

    <!-- STATE 2: FULL CRUD DASHBOARD -->
    <div v-else class="space-y-10">

      <!-- Navigation Segment Admin -->
      <div class="flex gap-2 border-b border-white/[0.08] pb-2 font-mono text-xs">
        <button 
          @click="activeAdminTab = 'projects'"
          class="px-4 py-2 rounded-lg transition-colors font-medium"
          :class="activeAdminTab === 'projects' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'"
        >
          Karya Website ({{ projectList.length }})
        </button>
        <button 
          @click="activeAdminTab = 'socials'"
          class="px-4 py-2 rounded-lg transition-colors font-medium"
          :class="activeAdminTab === 'socials' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'"
        >
          Feed Bento TikTok/IG ({{ socialList.length }})
        </button>
      </div>

      <!-- ================= SECTION 1: CRUD KARYA WEBSITE ================= -->
      <section v-if="activeAdminTab === 'projects'" class="space-y-6">
        
        <!-- Form Tambah / Edit Project -->
        <div class="p-5 rounded-2xl bg-[#111111] border border-white/[0.08] space-y-4">
          <h3 class="text-sm font-semibold text-white">
            {{ editingProject ? 'Edit Karya Website' : '+ Tambah Karya Website Baru' }}
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="space-y-1">
              <label class="text-neutral-400">Judul Project *</label>
              <input v-model="projectForm.title" placeholder="Contoh: E-Commerce Platform" class="w-full p-2.5 rounded-lg bg-black border border-white/[0.1] text-white" />
            </div>
            <div class="space-y-1">
              <label class="text-neutral-400">Kategori</label>
              <input v-model="projectForm.category" placeholder="Contoh: Full-Stack Web" class="w-full p-2.5 rounded-lg bg-black border border-white/[0.1] text-white" />
            </div>
            <div class="sm:col-span-2 space-y-1">
              <label class="text-neutral-400">Tagline / Deskripsi Singkat *</label>
              <input v-model="projectForm.tagline" placeholder="Jelaskan ringkas apa fungsi website ini..." class="w-full p-2.5 rounded-lg bg-black border border-white/[0.1] text-white" />
            </div>
            <div class="space-y-1">
              <label class="text-neutral-400">Live URL (Demo)</label>
              <input v-model="projectForm.live_url" placeholder="https://..." class="w-full p-2.5 rounded-lg bg-black border border-white/[0.1] text-white" />
            </div>
            <div class="space-y-1">
              <label class="text-neutral-400">GitHub Repo URL</label>
              <input v-model="projectForm.github_url" placeholder="https://github.com/..." class="w-full p-2.5 rounded-lg bg-black border border-white/[0.1] text-white" />
            </div>
            <div class="sm:col-span-2 space-y-1">
              <label class="text-neutral-400">Tech Stack (Pisahkan dengan koma)</label>
              <input v-model="techStackInput" placeholder="Vue 3, Nuxt, Tailwind, Supabase" class="w-full p-2.5 rounded-lg bg-black border border-white/[0.1] text-white" />
            </div>
          </div>

          <div class="flex gap-2 pt-2">
            <button 
              @click="saveProject"
              class="px-5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
            >
              {{ editingProject ? 'Perbarui Project' : 'Simpan Project' }}
            </button>
            <button 
              v-if="editingProject"
              @click="cancelEditProject"
              class="px-4 py-2 rounded-lg bg-white/[0.05] text-neutral-300 text-xs hover:bg-white/[0.1]"
            >
              Batal
            </button>
          </div>
        </div>

        <!-- Tabel List Projects (Read, Update, Delete) -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-white">Daftar Project di Database ({{ projectList.length }})</h3>
          
          <div v-if="projectList.length === 0" class="text-xs text-neutral-500 py-4 text-center">
            Database project masih kosong. Tambahkan project pertama di form atas!
          </div>

          <div 
            v-for="p in projectList" 
            :key="p.id"
            class="p-4 rounded-xl bg-[#111111] border border-white/[0.06] flex items-center justify-between gap-4"
          >
            <div>
              <h4 class="text-xs font-semibold text-white">{{ p.title }}</h4>
              <p class="text-[11px] text-neutral-400">{{ p.tagline }}</p>
              <div class="flex gap-1 pt-1">
                <span v-for="t in p.tech_stack" :key="t" class="text-[9px] px-1.5 py-0.2 bg-white/5 rounded text-neutral-400">
                  {{ t }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button 
                @click="startEditProject(p)"
                class="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
              >
                Edit
              </button>
              <button 
                @click="promptDeleteProject(p)"
                class="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>

      </section>

      <!-- ================= SECTION 2: CRUD FEED TIKTOK / INSTAGRAM ================= -->
      <section v-if="activeAdminTab === 'socials'" class="space-y-6">
        
        <!-- Form Tambah Feed (Quick Sync Link) -->
        <div class="p-5 rounded-2xl bg-[#111111] border border-white/[0.08] space-y-4">
          <h3 class="text-sm font-semibold text-white">+ Sync Konten Baru (TikTok / IG)</h3>
          <p class="text-xs text-neutral-400">
            Paste link konten TikTok atau Instagram Anda. Metadata & thumbnail akan otomatis ditarik.
          </p>

          <div class="flex flex-col sm:flex-row gap-2">
            <input 
              v-model="socialUrlInput"
              type="text"
              placeholder="https://www.tiktok.com/@.../photo/... atau video"
              class="flex-1 px-3.5 py-2.5 rounded-lg bg-black border border-white/[0.1] text-white text-xs focus:outline-none focus:border-white"
            />
            <button 
              @click="syncSocialContent"
              :disabled="isSyncing || !socialUrlInput"
              class="px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {{ isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Konten ⚡' }}
            </button>
          </div>
        </div>

        <!-- List Social Feeds (Delete & Action) -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-white">Daftar Konten Feed Aktif ({{ socialList.length }})</h3>

          <div v-if="socialList.length === 0" class="text-xs text-neutral-500 py-4 text-center">
            Belum ada feed konten yang di-sync.
          </div>

          <div 
            v-for="feed in socialList" 
            :key="feed.id"
            class="p-4 rounded-xl bg-[#111111] border border-white/[0.06] flex items-center justify-between gap-4"
          >
            <div class="flex items-center gap-3">
              <div v-if="feed.thumbnail_url" class="w-12 h-16 rounded overflow-hidden bg-black flex-shrink-0">
                <img :src="feed.thumbnail_url" class="w-full h-full object-cover" />
              </div>
              <div>
                <span class="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-white">
                  {{ feed.platform }}
                </span>
                <p class="text-xs text-neutral-200 mt-1 line-clamp-1">{{ feed.caption }}</p>
                <a :href="feed.permalink" target="_blank" class="text-[10px] text-neutral-500 hover:underline">
                  {{ feed.permalink }}
                </a>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button 
                @click="promptDeleteSocial(feed)"
                class="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>

      </section>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const passwordInput = ref('')
const isAuthenticated = ref(false)
const loginError = ref('')
const activeAdminTab = ref('projects')

const projectList = ref([])
const socialList = ref([])

// Toast Modal State
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3500)
}

// Custom Confirmation Popup Modal State
const confirmModal = ref({
  show: false,
  title: '',
  message: '',
  loading: false,
  action: null
})

const promptDeleteProject = (p) => {
  confirmModal.value = {
    show: true,
    title: `Hapus Project "${p.title}"?`,
    message: 'Data project ini akan dihapus permanen dari Supabase dan tidak lagi muncul di portofolio.',
    loading: false,
    action: () => executeDeleteProject(p.id)
  }
}

const promptDeleteSocial = (feed) => {
  confirmModal.value = {
    show: true,
    title: `Hapus Feed ${feed.platform.toUpperCase()}?`,
    message: 'Postingan ini akan dihapus dari Bento Grid portofolio.',
    loading: false,
    action: () => executeDeleteSocial(feed.id)
  }
}

const executeConfirmedAction = async () => {
  if (confirmModal.value.action) {
    confirmModal.value.loading = true
    await confirmModal.value.action()
    confirmModal.value.loading = false
    confirmModal.value.show = false
  }
}

// Project Form State
const editingProject = ref(null)
const techStackInput = ref('')
const projectForm = ref({
  title: '',
  category: 'Full-Stack Web',
  tagline: '',
  live_url: '',
  github_url: ''
})

// Social Sync Form State
const socialUrlInput = ref('')
const isSyncing = ref(false)

const { $supabase } = useNuxtApp()

const handleLogin = () => {
  if (passwordInput.value === 'amru2026') {
    isAuthenticated.value = true
    loginError.value = ''
    passwordInput.value = ''
    showToast('Login berhasil. Selamat datang Amru!')
    fetchAdminData()
  } else {
    loginError.value = 'Kata sandi salah.'
    showToast('Kata sandi admin tidak valid!', 'error')
  }
}

const logout = () => {
  isAuthenticated.value = false
  showToast('Sesi admin telah ditutup.')
}

const fetchAdminData = async () => {
  if (!$supabase) return

  const { data: projData, error: pErr } = await $supabase
    .from('projects')
    .select('*')
    .order('order_priority', { ascending: false })

  if (!pErr && projData) projectList.value = projData

  const { data: socData, error: sErr } = await $supabase
    .from('social_feeds')
    .select('*')
    .order('posted_at', { ascending: false })

  if (!sErr && socData) socialList.value = socData
}

// ================= CRUD PROJECTS =================
const saveProject = async () => {
  if (!projectForm.value.title || !projectForm.value.tagline) {
    showToast('Judul dan Tagline wajib diisi!', 'error')
    return
  }

  const stackArray = techStackInput.value
    ? techStackInput.value.split(',').map(s => s.trim()).filter(Boolean)
    : []

  const payload = {
    title: projectForm.value.title,
    slug: projectForm.value.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: projectForm.value.category || 'Website Project',
    tagline: projectForm.value.tagline,
    live_url: projectForm.value.live_url || '#',
    github_url: projectForm.value.github_url || '#',
    tech_stack: stackArray,
    featured: true
  }

  if (editingProject.value) {
    const { error } = await $supabase
      .from('projects')
      .update(payload)
      .eq('id', editingProject.value.id)

    if (error) {
      showToast(`Gagal update: ${error.message}`, 'error')
    } else {
      showToast('Karya website berhasil diperbarui!')
      cancelEditProject()
    }
  } else {
    const { error } = await $supabase
      .from('projects')
      .insert([payload])

    if (error) {
      showToast(`Gagal simpan: ${error.message}`, 'error')
    } else {
      showToast('Karya website baru berhasil ditambahkan!')
      resetProjectForm()
    }
  }

  await fetchAdminData()
}

const startEditProject = (p) => {
  editingProject.value = p
  projectForm.value = {
    title: p.title,
    category: p.category,
    tagline: p.tagline,
    live_url: p.live_url,
    github_url: p.github_url
  }
  techStackInput.value = (p.tech_stack || []).join(', ')
}

const cancelEditProject = () => {
  editingProject.value = null
  resetProjectForm()
}

const resetProjectForm = () => {
  projectForm.value = {
    title: '',
    category: 'Full-Stack Web',
    tagline: '',
    live_url: '',
    github_url: ''
  }
  techStackInput.value = ''
}

const executeDeleteProject = async (id) => {
  const { error } = await $supabase.from('projects').delete().eq('id', id)
  if (error) {
    showToast(`Gagal menghapus: ${error.message}`, 'error')
  } else {
    showToast('Project berhasil dihapus dari database!')
    await fetchAdminData()
  }
}

// ================= CRUD SOCIALS =================
const syncSocialContent = async () => {
  if (!socialUrlInput.value) return
  isSyncing.value = true

  try {
    const preview = await $fetch(`/api/social/preview?url=${encodeURIComponent(socialUrlInput.value)}`)

    const { error } = await $supabase.from('social_feeds').insert([
      {
        platform: preview.platform,
        external_id: String(preview.external_id || Date.now()),
        caption: preview.title || preview.caption || 'Portofolio Showcase',
        media_type: preview.media_type || 'image',
        media_url: preview.permalink,
        permalink: preview.permalink,
        thumbnail_url: preview.thumbnail_url || null,
        posted_at: new Date().toISOString(),
        is_featured: true
      }
    ])

    if (error) throw error

    showToast('Konten berhasil di-sync & tampil di Bento Grid!')
    socialUrlInput.value = ''
    await fetchAdminData()
  } catch (err) {
    showToast(`Gagal: ${err.message || err}`, 'error')
  } finally {
    isSyncing.value = false
  }
}

const executeDeleteSocial = async (id) => {
  const { error } = await $supabase.from('social_feeds').delete().eq('id', id)
  if (error) {
    showToast(`Gagal menghapus feed: ${error.message}`, 'error')
  } else {
    showToast('Feed konten berhasil dihapus!')
    await fetchAdminData()
  }
}

onMounted(() => {
  if (isAuthenticated.value) {
    fetchAdminData()
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
