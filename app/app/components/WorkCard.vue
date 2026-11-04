<template>
  <article class="reveal group relative" :class="item.aspect_ratio === '16:9' ? 'sm:col-span-2' : ''" v-reveal="delay">
    <button
      type="button"
      class="block w-full text-left"
      data-cursor="Lihat"
      :aria-label="`Lihat detail: ${item.title}`"
      @click="$emit('open', item.id)"
    >
      <div class="relative overflow-hidden bg-ink/[0.06]" :class="aspectClass(item.aspect_ratio)">
        <div v-if="!loaded && !failed" class="skeleton absolute inset-0" />
        <img
          v-if="!failed"
          ref="img"
          :src="item.preview_url"
          :alt="item.title"
          loading="lazy"
          decoding="async"
          class="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.045]"
          :class="loaded ? 'opacity-100' : 'opacity-0'"
          @load="loaded = true"
          @error="failed = true"
        />
        <div
          v-else
          class="absolute inset-0 grid place-items-center p-6 text-center font-display text-lg text-ink/55"
        >
          {{ item.title }}
        </div>

        <span class="label absolute left-3 top-3 bg-paper px-2 py-1.5 !text-ink">{{ platformLabel(item.platform) }}</span>

        <span
          class="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center bg-accent text-paper opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Icon name="arrow-up-right" :size="18" />
        </span>
      </div>
    </button>

    <div class="mt-4 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-[11px] tabular-nums tracking-wide text-ink/65">
          {{ number }} · {{ item.category || 'Karya' }}
        </p>
        <h3 class="mt-1.5 font-display text-xl leading-snug tracking-tight">
          <span class="link-u-group">{{ item.title }}</span>
        </h3>
      </div>
      <ReactionBar :item-id="item.id" compact :size="17" class="-mr-2 -mt-1.5 shrink-0" />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { PortfolioItem } from '~/utils/portfolio'

const props = defineProps({
  item: { type: Object as PropType<PortfolioItem>, required: true },
  index: { type: Number, default: 0 },
  delay: { type: Number, default: 0 }
})
defineEmits<{ open: [id: string] }>()

const loaded = ref(false)
const failed = ref(false)
const img = ref<HTMLImageElement | null>(null)

const number = computed(() => String(props.index + 1).padStart(2, '0'))

// Gambar yang sudah ada di cache bisa selesai dimuat sebelum handler @load terpasang.
onMounted(() => {
  if (img.value?.complete && img.value.naturalWidth > 0) loaded.value = true
})
</script>

