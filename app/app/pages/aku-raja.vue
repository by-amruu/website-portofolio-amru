<template>
  <div class="space-y-10 max-w-4xl mx-auto pb-20 relative">
    
    <!-- 🔔 TOAST NOTIFICATION -->
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

    <!-- ⚠️ CONFIRMATION POPUP MODAL -->
    <div 
      v-if="confirmModal.show" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
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
            {{ confirmModal.loading ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Header Admin -->
    <div class="flex items-center justify-between border-b border-white/[0.08] pb-4">
      <div>
        <h1 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>🛡️</span> Amru Portfolio Manager
        </h1>
        <p class="text-xs text-neutral-400">
          Upload file gambar langsung atau masukkan link karya (Website, IG, TikTok, Pinterest).
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

    <!-- STATE 1: LOGIN -->
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
      <p v-if="loginError" class="text-red-400 text-xs text-center">{{ loginError }}</p>
    </div>

    <!-- STATE 2: UNIVERSAL CRUD DASHBOARD DENGAN DIRECT FILE UPLOAD -->
    <div v-else class="space-y-10">

      <!-- ================= 1. FORM INPUT KARYA ================= -->
      <section class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] space-y-5">
        
        <div class="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h3 class="text-sm font-semibold text-white">
            {{ editingItem ? 'Edit Karya Portofolio' : '+ Tambah Karya Baru' }}
          </h3>
          <span class="text-[11px] font-mono text-emerald-400">Direct Upload & URL Ready</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div class="space-y-1">
            <label class="text-neutral-400 font-medium">Judul Karya *</label>
            <input v-model="form.title" placeholder="Contoh: Redesign Kemasan Keripik Jamur" class="w-full p-2.5 rounded-lg bg-black border border-white/[0.1] text-white" />
          </div>

          <div class="space-y-1">
            <label class="text-neutral-400 font-medium">Platform *</label>
            <select v-model="form.platform" class="w-full p-2.5 rounded-lg bg-black border border-white/[0.1] text-white">
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="pinterest">Pinterest</option>
              <option value="website">Website Project</option>
            </select>
          </div>

          <div class="sm:col-span-2 space-y-1">
            <label class="text-neutral-400 font-medium">Deskripsi Singkat</label>
            <textarea v-model="form.description" rows="2" placeholder="Ceritakan konsep karya ini..." class="w-full p-2.5 rounded-lg bg-black border border-white/[0.1] text-white"></textarea>
          </div>

          <!-- OPSI GAMBAR: UPLOAD FILE ASLI DARI HP/LAPTOP ATAU PASTE URL -->
          <div class="sm:col-span-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
            <label class="text-xs font-semibold text-white block">
              📸 Gambar Preview Karya (Pilih salah satu cara)
            </label>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Cara 1: Upload File Langsung (Paling Mudah untuk IG & TikTok!) -->
              <div class="space-y-1.5">
                <span class="text-[11px] text-neutral-400 font-medium">Cara A: Upload File Langsung (Foto Asli / Screenshot)</span>
                <input 
                  type="file" 
                  accept="image/*"
                  @change="handleFileUpload" 
                  class="w-full text-xs text-neutral-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-neutral-200 cursor-pointer"
                />
                <span v-if="isUploading" class="text-[10px] text-[#FFE600] font-mono block">Mengunggah ke Supabase...</span>
              </div>

              <!-- Cara 2: Paste URL Gambar -->
              <div class="space-y-1.5">
                <span class="text-[11px] text-neutral-400 font-medium">Cara B: Atau Paste URL Gambar yang Sudah Ada</span>
                <input v-model="form.preview_url" placeholder="https://..." class="w-full p-2 rounded-lg bg-black border border-white/[0.1] text-white text-[11px] font-mono" />
              </div>
            </div>

            <!-- Preview Image Thumbnail Box -->
            <div v-if="form.preview_url" class="pt-2 flex items-center gap-3">
              <img :src="form.preview_url" class="w-14 h-16 rounded-lg object-cover border border-white/20" alt="Preview" />
              <span class="text-[11px] text-emerald-400 font-mono">✓ Gambar preview siap ditampilkan</span>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-neutral-400 font-medium">Link Asli Karya (Live URL / Link Post IG/TikTok)</label>
            <input v-model="form.live_url" placeholder="https://www.instagram.com/p/... atau website" class="w-full p-2.5 rounded-lg bg-black border border-white/[0.1] text-white" />
          </div>

          <div class="space-y-1">
            <label class="text-neutral-400 font-medium">Aspek Rasio Preview</label>
            <select v-model="form.aspect_ratio" class="w-full p-2.5 rounded-lg bg-black border border-white/[0.1] text-white">
              <option value="3:4">3:4 (Feed Foto IG & Pinterest: 1080x1440)</option>
              <option value="9:16">9:16 (Vertikal Layar Penuh TikTok: 1080x1920)</option>
              <option value="16:9">16:9 (Lanskap Screenshot Website: 1920x1080)</option>
            </select>
          </div>

          <div class="sm:col-span-2 space-y-1">
            <label class="text-neutral-400 font-medium">Tags (Pisahkan dengan koma)</label>
            <input v-model="tagsInput" placeholder="Affinity by Canva, Desain Grafis, AI Tools" class="w-full p-2.5 rounded-lg bg-black border border-white/[0.1] text-white" />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 pt-2 border-t border-white/[0.06]">
          <button 
            @click="saveItem"
            :disabled="isUploading"
            class="px-6 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {{ editingItem ? 'Perbarui Karya' : 'Simpan ke Portofolio' }}
          </button>
          <button 
            v-if="editingItem"
            @click="cancelEdit"
            class="px-4 py-2.5 rounded-lg bg-white/[0.05] text-neutral-300 text-xs hover:bg-white/[0.1]"
          >
            Batal
          </button>
        </div>

      </section>

      <!-- ================= 2. DAFTAR KARYA DI DATABASE ================= -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-white">Daftar Karya Aktif ({{ itemList.length }})</h3>
          <span class="text-xs text-neutral-500 font-mono">Real-time Supabase</span>
        </div>

        <div v-if="itemList.length === 0" class="text-xs text-neutral-500 py-8 text-center border border-dashed border-white/10 rounded-2xl">
          Database portofolio masih kosong. Tambahkan karya pertama Anda di form atas!
        </div>

        <div 
          v-for="item in itemList" 
          :key="item.id"
          class="p-4 rounded-xl bg-[#111111] border border-white/[0.06] flex items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <div class="w-14 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10">
              <img :src="item.preview_url" class="w-full h-full object-cover" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-white">
                  {{ item.platform }}
                </span>
                <span class="text-[9px] font-mono text-neutral-400">
                  {{ item.aspect_ratio }}
                </span>
              </div>
              <h4 class="text-xs font-semibold text-white mt-1">{{ item.title }}</h4>
              <p class="text-[11px] text-neutral-400 line-clamp-1">{{ item.description }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button @click="startEdit(item)" class="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white">Edit</button>
            <button @click="promptDelete(item)" class="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400">Hapus</button>
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

const itemList = ref([])
const editingItem = ref(null)
const tagsInput = ref('')
const isUploading = ref(false)

const form = ref({
  title: '',
  platform: 'instagram',
  description: '',
  preview_url: '',
  live_url: '',
  aspect_ratio: '3:4'
})

// Toast State
const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3500)
}

// Confirmation Modal State
const confirmModal = ref({ show: false, title: '', message: '', loading: false, action: null })
const promptDelete = (item) => {
  confirmModal.value = {
    show: true,
    title: `Hapus "${item.title}"?`,
    message: 'Karya ini akan dihapus permanen dari portofolio.',
    loading: false,
    action: () => executeDelete(item.id)
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

const { $supabase } = useNuxtApp()

const handleLogin = () => {
  if (passwordInput.value === 'amru2026') {
    isAuthenticated.value = true
    loginError.value = ''
    passwordInput.value = ''
    showToast('Login berhasil!')
    fetchData()
  } else {
    loginError.value = 'Kata sandi salah.'
    showToast('Kata sandi salah!', 'error')
  }
}

const logout = () => {
  isAuthenticated.value = false
}

const fetchData = async () => {
  if (!$supabase) return
  const { data, error } = await $supabase
    .from('portfolio_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (!error && data) {
    itemList.value = data
  }
}

// FITUR UPLOAD FILE LANGSUNG KE SUPABASE STORAGE
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  try {
    const ext = file.name.split('.').pop()
    const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`

    // Upload langsung lewat Supabase client
    const { data, error } = await $supabase.storage
      .from('portfolio-media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) throw error

    // Ambil Public URL
    const { data: publicData } = $supabase.storage
      .from('portfolio-media')
      .getPublicUrl(fileName)

    form.value.preview_url = publicData.publicUrl
    showToast('Gambar berhasil diupload ke Supabase Storage!')
  } catch (err) {
    console.error('Upload Error:', err)
    showToast(`Upload gagal: ${err.message}`, 'error')
  } finally {
    isUploading.value = false
  }
}

// Save (Create / Update)
const saveItem = async () => {
  if (!form.value.title || !form.value.preview_url) {
    showToast('Judul dan Gambar Preview wajib diisi!', 'error')
    return
  }

  const tags = tagsInput.value ? tagsInput.value.split(',').map(s => s.trim()).filter(Boolean) : []

  const payload = {
    title: form.value.title,
    platform: form.value.platform,
    description: form.value.description,
    preview_url: form.value.preview_url,
    live_url: form.value.live_url,
    aspect_ratio: form.value.aspect_ratio,
    tech_stack: tags
  }

  if (editingItem.value) {
    const { error } = await $supabase.from('portfolio_items').update(payload).eq('id', editingItem.value.id)
    if (error) showToast(error.message, 'error')
    else { showToast('Karya berhasil diperbarui!'); cancelEdit(); }
  } else {
    const { error } = await $supabase.from('portfolio_items').insert([payload])
    if (error) showToast(error.message, 'error')
    else { showToast('Karya berhasil ditambahkan!'); resetForm(); }
  }

  await fetchData()
}

const startEdit = (item) => {
  editingItem.value = item
  form.value = { ...item }
  tagsInput.value = (item.tech_stack || []).join(', ')
}

const cancelEdit = () => {
  editingItem.value = null
  resetForm()
}

const resetForm = () => {
  form.value = { title: '', platform: 'instagram', description: '', preview_url: '', live_url: '', aspect_ratio: '3:4' }
  tagsInput.value = ''
}

const executeDelete = async (id) => {
  const { error } = await $supabase.from('portfolio_items').delete().eq('id', id)
  if (error) showToast(error.message, 'error')
  else { showToast('Karya berhasil dihapus!'); await fetchData(); }
}

onMounted(() => {
  if (isAuthenticated.value) fetchData()
})
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateY(-20px); }
.toast-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
