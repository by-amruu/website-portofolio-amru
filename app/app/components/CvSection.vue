<template>
  <section id="cv" class="relative mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-32">
    <!-- Header Section -->
    <div class="reveal flex flex-col justify-between gap-6 border-b border-ink/10 pb-10 md:flex-row md:items-end" v-reveal>
      <div>
        <p class="label flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-accent" /> Profil &amp; Rekam Jejak
        </p>
        <h2 class="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Curriculum Vitae<span class="text-accent">.</span>
        </h2>
      </div>

      <!-- Switcher Lens: Desain Grafis VS Web Developer -->
      <div class="flex items-center rounded-none border border-ink/20 p-1">
        <button
          type="button"
          class="flex items-center gap-2 px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors duration-200"
          :class="activeRole === 'design' ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink'"
          @click="activeRole = 'design'"
        >
          <span>🎨 Desain Grafis</span>
        </button>
        <button
          type="button"
          class="flex items-center gap-2 px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors duration-200"
          :class="activeRole === 'dev' ? 'bg-ink text-paper' : 'text-ink/60 hover:text-ink'"
          @click="activeRole = 'dev'"
        >
          <span>💻 Web Developer</span>
        </button>
      </div>
    </div>

    <!-- Ringkasan Bio & Tombol Unduh PDF -->
    <div class="reveal mt-12 grid gap-10 md:grid-cols-12 md:items-start" v-reveal="150">
      <div class="md:col-span-8">
        <p class="font-display text-2xl leading-snug tracking-tight text-ink sm:text-3xl">
          {{ activeBio }}
        </p>
      </div>
      <div class="flex flex-col gap-3 md:col-span-4 md:items-end">
        <a
          v-if="currentPdfUrl"
          :href="currentPdfUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-ink inline-flex items-center gap-2 text-xs uppercase tracking-wider"
        >
          <Icon name="arrow-down" :size="15" />
          <span>Unduh CV {{ activeRole === 'design' ? 'Desain Grafis' : 'Web Developer' }} (PDF)</span>
        </a>
        <span v-else class="text-xs text-ink/40">
          Berkas PDF belum diunggah di admin.
        </span>
      </div>
    </div>

    <!-- Timeline Grid: Pengalaman & Pendidikan -->
    <div class="reveal mt-20 grid gap-16 lg:grid-cols-12 lg:gap-12" v-reveal="300">
      <!-- Kolom Pengalaman Kerja / Proyek -->
      <div class="lg:col-span-7">
        <div class="flex items-center justify-between border-b border-ink/10 pb-4">
          <h3 class="label !text-sm text-ink">Pengalaman Kerja &amp; Praktik</h3>
          <span class="text-xs tabular-nums text-ink/50">{{ experiences.length }} entri</span>
        </div>

        <div v-if="experiences.length === 0" class="py-12 text-sm text-ink/45">
          Belum ada riwayat pengalaman untuk kategori ini.
        </div>

        <ol v-else class="relative mt-8 space-y-10 border-l border-ink/15 pl-6 sm:pl-8">
          <li v-for="item in experiences" :key="item.id" class="group relative">
            <!-- Bullet node -->
            <span class="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border border-ink/30 bg-paper transition-colors duration-300 group-hover:border-accent group-hover:bg-accent sm:-left-[39px]" />

            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <h4 class="font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
                {{ item.title }}
              </h4>
              <span class="font-mono text-xs tabular-nums tracking-wide text-accent">{{ item.period }}</span>
            </div>

            <p class="mt-1 text-xs uppercase tracking-widest text-ink/60">
              {{ item.organization }}
            </p>

            <p v-if="item.description" class="mt-3 text-sm leading-relaxed text-ink/75">
              {{ item.description }}
            </p>

            <!-- Skill Tags -->
            <div v-if="item.skills && item.skills.length" class="mt-4 flex flex-wrap gap-1.5">
              <span
                v-for="s in item.skills"
                :key="s"
                class="border border-ink/10 bg-ink/[0.03] px-2 py-0.5 text-[11px] text-ink/70"
              >
                {{ s }}
              </span>
            </div>
          </li>
        </ol>
      </div>

      <!-- Kolom Pendidikan / Sertifikasi & Keahlian Inti -->
      <div class="space-y-14 lg:col-span-5">
        <div>
          <div class="flex items-center justify-between border-b border-ink/10 pb-4">
            <h3 class="label !text-sm text-ink">Pendidikan &amp; Kursus</h3>
            <span class="text-xs tabular-nums text-ink/50">{{ educations.length }} entri</span>
          </div>

          <div v-if="educations.length === 0" class="py-8 text-sm text-ink/45">
            Belum ada data pendidikan untuk kategori ini.
          </div>

          <div v-else class="mt-6 space-y-6">
            <article v-for="edu in educations" :key="edu.id" class="border-b border-ink/5 pb-5">
              <div class="flex items-baseline justify-between gap-2">
                <h4 class="font-display text-lg font-medium text-ink">{{ edu.title }}</h4>
                <span class="font-mono text-xs tabular-nums text-ink/50">{{ edu.period }}</span>
              </div>
              <p class="mt-0.5 text-xs text-ink/65">{{ edu.organization }}</p>
              <p v-if="edu.description" class="mt-2 text-xs leading-relaxed text-ink/70">
                {{ edu.description }}
              </p>
            </article>
          </div>
        </div>

        <!-- Software & Stack Highlight -->
        <div class="border border-ink/15 bg-ink/[0.02] p-6 sm:p-8">
          <h4 class="label mb-4 text-ink">Spesialisasi {{ activeRole === 'design' ? 'Desain Grafis' : 'Web Developer' }}</h4>
          <p class="text-xs leading-relaxed text-ink/70">
            {{ activeRole === 'design' 
              ? 'Penguasaan software tata letak, komposisi visual, identitas jenama (branding), kemasan siap cetak, serta materi konten digital media sosial.' 
              : 'Perancangan arsitektur antarmuka modern yang ringan, teroptimasi SEO, interaktif, responsif multi-device, dan terintegrasi backend Supabase.' }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CvSettings, CvEntry } from '~/utils/portfolio'

const props = defineProps<{
  settings?: CvSettings | null
  entries?: CvEntry[]
}>()

const activeRole = ref<'design' | 'dev'>('design')

const activeBio = computed(() => {
  if (activeRole.value === 'design') {
    return props.settings?.design_bio || 'Fokus pada eksplorasi identitas visual, kemasan bernilai jual, dan konten edukasi grafis dengan pendekatan estetik kontemporer.'
  }
  return props.settings?.dev_bio || 'Membangun antarmuka web modern yang cepat, interaktif, responsif, dan bebas dari desain generik dengan Nuxt, Vue, dan Tailwind CSS.'
})

const currentPdfUrl = computed(() => {
  return activeRole.value === 'design' 
    ? props.settings?.design_cv_url 
    : props.settings?.dev_cv_url
})

// Filter data berdasarkan activeRole ('design' / 'dev' atau 'both')
const currentRoleEntries = computed(() => {
  const list = props.entries ?? []
  return list.filter((e) => e.role_type === activeRole.value || e.role_type === 'both')
})

const experiences = computed(() => {
  return currentRoleEntries.value.filter((e) => e.entry_type === 'experience')
})

const educations = computed(() => {
  return currentRoleEntries.value.filter((e) => e.entry_type === 'education')
})
</script>

