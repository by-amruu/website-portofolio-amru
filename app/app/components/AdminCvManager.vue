<template>
  <div class="space-y-12">
    <!-- 1. PENGATURAN BIO & BERKAS PDF CV -->
    <div class="border border-ink/15 bg-paper p-6 sm:p-8">
      <div class="flex items-center justify-between border-b border-ink/10 pb-4">
        <div>
          <h2 class="font-display text-2xl tracking-tight text-ink">Pengaturan Dokumen CV &amp; Bio</h2>
          <p class="mt-1 text-xs text-ink/60">Upload berkas PDF CV dan atur pengantar singkat untuk Desain Grafis &amp; Web Developer.</p>
        </div>
        <button
          type="button"
          :disabled="savingSettings"
          class="btn-ink text-xs disabled:opacity-50"
          @click="saveSettings"
        >
          <span>{{ savingSettings ? 'Menyimpan...' : 'Simpan Pengaturan' }}</span>
        </button>
      </div>

      <div class="mt-8 grid gap-8 md:grid-cols-2">
        <!-- Desain Grafis -->
        <div class="space-y-4 rounded-none border border-ink/10 p-5 bg-ink/[0.01]">
          <span class="label text-accent">🎨 Desain Grafis</span>
          <div>
            <label class="text-xs font-medium text-ink/80">Bio Singkat Desain</label>
            <textarea
              v-model="localSettings.design_bio"
              rows="3"
              class="field mt-1.5 text-xs"
              placeholder="Fokus pada eksplorasi identitas visual..."
            />
          </div>
          <div>
            <label class="text-xs font-medium text-ink/80">Berkas PDF CV Desain</label>
            <div class="mt-2 flex items-center gap-3">
              <input
                type="file"
                accept="application/pdf"
                class="hidden"
                ref="designPdfInput"
                @change="handlePdfUpload($event, 'design')"
              />
              <button
                type="button"
                :disabled="uploadingPdf === 'design'"
                class="border border-ink/20 px-3 py-2 text-xs font-medium hover:border-accent"
                @click="designPdfInput?.click()"
              >
                {{ uploadingPdf === 'design' ? 'Mengunggah...' : 'Pilih Berkas PDF' }}
              </button>
              <a
                v-if="localSettings.design_cv_url"
                :href="localSettings.design_cv_url"
                target="_blank"
                class="link-u text-xs text-accent"
              >
                Lihat PDF Terpasang ↗
              </a>
              <span v-else class="text-xs text-ink/40">Belum ada PDF</span>
            </div>
          </div>
        </div>

        <!-- Web Developer -->
        <div class="space-y-4 rounded-none border border-ink/10 p-5 bg-ink/[0.01]">
          <span class="label text-accent">💻 Web Developer</span>
          <div>
            <label class="text-xs font-medium text-ink/80">Bio Singkat Web Dev</label>
            <textarea
              v-model="localSettings.dev_bio"
              rows="3"
              class="field mt-1.5 text-xs"
              placeholder="Membangun antarmuka web modern..."
            />
          </div>
          <div>
            <label class="text-xs font-medium text-ink/80">Berkas PDF CV Developer</label>
            <div class="mt-2 flex items-center gap-3">
              <input
                type="file"
                accept="application/pdf"
                class="hidden"
                ref="devPdfInput"
                @change="handlePdfUpload($event, 'dev')"
              />
              <button
                type="button"
                :disabled="uploadingPdf === 'dev'"
                class="border border-ink/20 px-3 py-2 text-xs font-medium hover:border-accent"
                @click="devPdfInput?.click()"
              >
                {{ uploadingPdf === 'dev' ? 'Mengunggah...' : 'Pilih Berkas PDF' }}
              </button>
              <a
                v-if="localSettings.dev_cv_url"
                :href="localSettings.dev_cv_url"
                target="_blank"
                class="link-u text-xs text-accent"
              >
                Lihat PDF Terpasang ↗
              </a>
              <span v-else class="text-xs text-ink/40">Belum ada PDF</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. DAFTAR RIWAYAT PENGALAMAN & PENDIDIKAN -->
    <div>
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <h2 class="font-display text-2xl tracking-tight text-ink">Riwayat Pengalaman &amp; Pendidikan</h2>
          <p class="mt-1 text-xs text-ink/60">Kelola riwayat kerja, proyek lepas, dan pendidikan yang tampil di linimasa CV.</p>
        </div>
        <button type="button" class="btn-ink text-xs" @click="openNewEntry">
          <Icon name="plus" :size="14" />
          <span>Tambah Entri Baru</span>
        </button>
      </div>

      <!-- Filter Kategori Entri -->
      <div class="mt-6 flex flex-wrap gap-4 text-xs">
        <button
          v-for="f in ['all', 'design', 'dev'] as const"
          :key="f"
          type="button"
          class="px-3 py-1.5 border transition-colors"
          :class="entryFilter === f ? 'bg-ink text-paper border-ink' : 'border-ink/20 text-ink/70 hover:text-ink'"
          @click="entryFilter = f"
        >
          {{ f === 'all' ? 'Semua Kategori' : f === 'design' ? 'Desain Grafis' : 'Web Developer' }}
        </button>
      </div>

      <!-- List Entri -->
      <div v-if="filteredEntries.length === 0" class="border border-dashed border-ink/20 p-12 text-center text-sm text-ink/50 mt-6">
        Belum ada entri rekam jejak. Klik tombol "Tambah Entri Baru" di atas.
      </div>

      <div v-else class="mt-6 divide-y divide-ink/10 border border-ink/15 bg-paper">
        <article
          v-for="item in filteredEntries"
          :key="item.id"
          class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div class="min-w-0 space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="border border-ink/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink/70">
                {{ item.role_type === 'design' ? 'Desain' : item.role_type === 'dev' ? 'Web Dev' : 'Desain & Dev' }}
              </span>
              <span class="text-xs text-ink/40">·</span>
              <span class="text-xs uppercase tracking-wider text-ink/50">
                {{ item.entry_type === 'experience' ? 'Pengalaman' : 'Pendidikan' }}
              </span>
              <span class="text-xs text-ink/40">·</span>
              <span class="font-mono text-xs text-accent">{{ item.period }}</span>
            </div>

            <h3 class="font-display text-lg font-medium text-ink">{{ item.title }}</h3>
            <p class="text-xs text-ink/60">{{ item.organization }}</p>
            <p v-if="item.description" class="text-xs text-ink/70 max-w-2xl line-clamp-2">{{ item.description }}</p>

            <div v-if="item.skills && item.skills.length" class="flex flex-wrap gap-1 pt-1">
              <span v-for="s in item.skills" :key="s" class="bg-ink/[0.04] px-1.5 py-0.5 text-[10px] text-ink/60">
                {{ s }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-3 shrink-0 sm:self-center">
            <button
              type="button"
              class="border border-ink/20 px-3 py-1.5 text-xs hover:border-ink"
              @click="editEntry(item)"
            >
              Ubah
            </button>
            <button
              type="button"
              class="border border-red-500/20 px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10"
              @click="deleteEntry(item)"
            >
              Hapus
            </button>
          </div>
        </article>
      </div>
    </div>

    <!-- MODAL / DRAWER FORM ENTRI CV -->
    <Teleport to="body">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-50 flex items-center justify-end bg-paper/60 backdrop-blur-sm"
        @click.self="modalOpen = false"
      >
        <div class="h-full w-full max-w-lg border-l border-ink/15 bg-paper p-6 overflow-y-auto sm:p-8 flex flex-col justify-between">
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-ink/10 pb-4">
              <h3 class="font-display text-xl tracking-tight text-ink">
                {{ editingEntry?.id ? 'Ubah Entri Rekam Jejak' : 'Tambah Entri Baru' }}
              </h3>
              <button type="button" class="btn-icon !h-8 !w-8" @click="modalOpen = false">
                <Icon name="x" :size="16" />
              </button>
            </div>

            <form class="space-y-4" @submit.prevent="saveEntry">
              <div>
                <label class="text-xs font-medium text-ink/80">Kategori Bidang</label>
                <div class="grid grid-cols-3 gap-2 mt-1.5 text-xs">
                  <button
                    type="button"
                    class="border py-2 text-center"
                    :class="entryForm.role_type === 'design' ? 'bg-ink text-paper border-ink' : 'border-ink/20'"
                    @click="entryForm.role_type = 'design'"
                  >
                    🎨 Desain
                  </button>
                  <button
                    type="button"
                    class="border py-2 text-center"
                    :class="entryForm.role_type === 'dev' ? 'bg-ink text-paper border-ink' : 'border-ink/20'"
                    @click="entryForm.role_type = 'dev'"
                  >
                    💻 Web Dev
                  </button>
                  <button
                    type="button"
                    class="border py-2 text-center"
                    :class="entryForm.role_type === 'both' ? 'bg-ink text-paper border-ink' : 'border-ink/20'"
                    @click="entryForm.role_type = 'both'"
                  >
                    Keduanya
                  </button>
                </div>
              </div>

              <div>
                <label class="text-xs font-medium text-ink/80">Tipe Entri</label>
                <div class="grid grid-cols-2 gap-2 mt-1.5 text-xs">
                  <button
                    type="button"
                    class="border py-2 text-center"
                    :class="entryForm.entry_type === 'experience' ? 'bg-ink text-paper border-ink' : 'border-ink/20'"
                    @click="entryForm.entry_type = 'experience'"
                  >
                    Pengalaman Kerja
                  </button>
                  <button
                    type="button"
                    class="border py-2 text-center"
                    :class="entryForm.entry_type === 'education' ? 'bg-ink text-paper border-ink' : 'border-ink/20'"
                    @click="entryForm.entry_type = 'education'"
                  >
                    Pendidikan / Kursus
                  </button>
                </div>
              </div>

              <div>
                <label class="text-xs font-medium text-ink/80">Peran / Jabatan / Gelar</label>
                <input
                  v-model="entryForm.title"
                  type="text"
                  required
                  placeholder="cth: Freelance Graphic Designer"
                  class="field mt-1.5 text-xs"
                />
              </div>

              <div>
                <label class="text-xs font-medium text-ink/80">Institusi / Perusahaan / Klien</label>
                <input
                  v-model="entryForm.organization"
                  type="text"
                  required
                  placeholder="cth: Studio Amru / Klien Mandiri"
                  class="field mt-1.5 text-xs"
                />
              </div>

              <div>
                <label class="text-xs font-medium text-ink/80">Periode Waktu</label>
                <input
                  v-model="entryForm.period"
                  type="text"
                  required
                  placeholder="cth: 2023 — Sekarang"
                  class="field mt-1.5 text-xs"
                />
              </div>

              <div>
                <label class="text-xs font-medium text-ink/80">Deskripsi Singkat / Capaian</label>
                <textarea
                  v-model="entryForm.description"
                  rows="3"
                  placeholder="Mendesain identitas brand, materi promosi, dsb."
                  class="field mt-1.5 text-xs"
                />
              </div>

              <div>
                <label class="text-xs font-medium text-ink/80">Keahlian / Tools (Pisahkan dengan koma)</label>
                <input
                  v-model="rawSkills"
                  type="text"
                  placeholder="cth: Figma, Illustrator, Photoshop"
                  class="field mt-1.5 text-xs"
                />
              </div>

              <div>
                <label class="text-xs font-medium text-ink/80">Prioritas Urutan (Semakin besar semakin atas)</label>
                <input
                  v-model.number="entryForm.order_priority"
                  type="number"
                  class="field mt-1.5 text-xs"
                />
              </div>

              <div class="pt-4 flex gap-3">
                <button type="button" class="border border-ink/20 px-4 py-2.5 text-xs flex-1" @click="modalOpen = false">
                  Batal
                </button>
                <button type="submit" :disabled="savingEntry" class="btn-ink text-xs flex-1 justify-center">
                  {{ savingEntry ? 'Menyimpan...' : 'Simpan Entri' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { CvSettings, CvEntry } from '~/utils/portfolio'

const props = defineProps<{
  settings: CvSettings | null
  entries: CvEntry[]
}>()

const emit = defineEmits<{
  'refresh-cv': []
}>()

const supabase = (useNuxtApp() as any).$supabase
const toast = useToast()
const { confirm } = useConfirm()

// --- State Settings ---
const localSettings = reactive<CvSettings>({
  design_bio: '',
  dev_bio: '',
  design_cv_url: null,
  dev_cv_url: null
})

watch(
  () => props.settings,
  (s) => {
    if (s) {
      localSettings.design_bio = s.design_bio ?? ''
      localSettings.dev_bio = s.dev_bio ?? ''
      localSettings.design_cv_url = s.design_cv_url ?? null
      localSettings.dev_cv_url = s.dev_cv_url ?? null
    }
  },
  { immediate: true }
)

const savingSettings = ref(false)
const uploadingPdf = ref<'design' | 'dev' | null>(null)
const designPdfInput = ref<HTMLInputElement | null>(null)
const devPdfInput = ref<HTMLInputElement | null>(null)

async function saveSettings() {
  if (!supabase) return
  savingSettings.value = true
  try {
    const { error } = await supabase.from('cv_settings').upsert({
      id: 'default',
      design_bio: localSettings.design_bio,
      dev_bio: localSettings.dev_bio,
      design_cv_url: localSettings.design_cv_url,
      dev_cv_url: localSettings.dev_cv_url,
      updated_at: new Date().toISOString()
    })
    if (error) throw error
    toast.success('Pengaturan CV & Bio berhasil disimpan.')
    emit('refresh-cv')
  } catch (err: any) {
    toast.error(err.message || 'Gagal menyimpan pengaturan CV.')
  } finally {
    savingSettings.value = false
  }
}

async function handlePdfUpload(event: Event, type: 'design' | 'dev') {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !supabase) return

  if (file.type !== 'application/pdf') {
    toast.error('Berkas harus berupa PDF.')
    input.value = ''
    return
  }

  uploadingPdf.value = type
  try {
    const fileName = `cv_${type}_${Date.now()}.pdf`
    const { error } = await supabase.storage
      .from('portfolio-media')
      .upload(`documents/${fileName}`, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf'
      })
    if (error) throw error

    const { data } = supabase.storage.from('portfolio-media').getPublicUrl(`documents/${fileName}`)
    if (type === 'design') {
      localSettings.design_cv_url = data.publicUrl
    } else {
      localSettings.dev_cv_url = data.publicUrl
    }

    toast.success(`PDF CV ${type === 'design' ? 'Desain' : 'Web Dev'} terunggah. Jangan lupa klik Simpan Pengaturan.`)
  } catch (err: any) {
    toast.error(err.message || 'Gagal mengunggah berkas PDF.')
  } finally {
    uploadingPdf.value = null
    input.value = ''
  }
}

// --- State CRUD Entri ---
const entryFilter = ref<'all' | 'design' | 'dev'>('all')
const filteredEntries = computed(() => {
  if (entryFilter.value === 'all') return props.entries
  return props.entries.filter((e) => e.role_type === entryFilter.value || e.role_type === 'both')
})

const modalOpen = ref(false)
const savingEntry = ref(false)
const editingEntry = ref<CvEntry | null>(null)
const rawSkills = ref('')

const entryForm = reactive<CvEntry>({
  role_type: 'design',
  entry_type: 'experience',
  title: '',
  organization: '',
  period: '',
  description: '',
  skills: [],
  order_priority: 0
})

function openNewEntry() {
  editingEntry.value = null
  entryForm.role_type = 'design'
  entryForm.entry_type = 'experience'
  entryForm.title = ''
  entryForm.organization = ''
  entryForm.period = ''
  entryForm.description = ''
  entryForm.skills = []
  entryForm.order_priority = 10
  rawSkills.value = ''
  modalOpen.value = true
}

function editEntry(item: CvEntry) {
  editingEntry.value = item
  entryForm.role_type = item.role_type
  entryForm.entry_type = item.entry_type
  entryForm.title = item.title
  entryForm.organization = item.organization
  entryForm.period = item.period
  entryForm.description = item.description ?? ''
  entryForm.skills = [...(item.skills ?? [])]
  entryForm.order_priority = item.order_priority ?? 0
  rawSkills.value = (item.skills ?? []).join(', ')
  modalOpen.value = true
}

async function saveEntry() {
  if (!supabase) return
  savingEntry.value = true

  // Parse skills
  const skillsArray = rawSkills.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const payload = {
    role_type: entryForm.role_type,
    entry_type: entryForm.entry_type,
    title: entryForm.title.trim(),
    organization: entryForm.organization.trim(),
    period: entryForm.period.trim(),
    description: entryForm.description?.trim() || null,
    skills: skillsArray,
    order_priority: entryForm.order_priority || 0
  }

  try {
    if (editingEntry.value?.id) {
      const { error } = await supabase
        .from('cv_entries')
        .update(payload)
        .eq('id', editingEntry.value.id)
      if (error) throw error
      toast.success('Entri berhasil diperbarui.')
    } else {
      const { error } = await supabase
        .from('cv_entries')
        .insert([payload])
      if (error) throw error
      toast.success('Entri baru berhasil ditambahkan.')
    }
    modalOpen.value = false
    emit('refresh-cv')
  } catch (err: any) {
    toast.error(err.message || 'Gagal menyimpan entri.')
  } finally {
    savingEntry.value = false
  }
}

async function deleteEntry(item: CvEntry) {
  const ok = await confirm({
    title: `Hapus “${item.title}”?`,
    message: 'Entri ini akan dihapus dari linimasa CV.',
    confirmText: 'Hapus Entri',
    tone: 'danger'
  })
  if (!ok || !supabase) return

  try {
    const { error } = await supabase.from('cv_entries').delete().eq('id', item.id)
    if (error) throw error
    toast.success('Entri berhasil dihapus.')
    emit('refresh-cv')
  } catch (err: any) {
    toast.error(err.message || 'Gagal menghapus entri.')
  }
}
</script>

