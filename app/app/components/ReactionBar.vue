<template>
  <div class="flex items-center gap-0.5" role="group" aria-label="Reaksi untuk karya ini">
    <button
      v-for="r in list"
      :key="r.key"
      type="button"
      class="group/rx relative inline-flex items-center gap-1.5 px-2 py-2 transition-colors duration-200"
      :class="rx.hasMine(itemId, r.key) ? 'text-accent' : 'text-ink/65 hover:text-ink'"
      :aria-pressed="rx.hasMine(itemId, r.key)"
      :aria-label="`${r.label}, ${rx.countOf(itemId, r.key)} reaksi`"
      :title="r.label"
      @click.stop="onClick(r.key)"
    >
      <span class="relative grid place-items-center" :class="{ pop: popping === r.key }">
        <Icon :name="r.icon" :size="size" :filled="rx.hasMine(itemId, r.key)" />
        <span
          v-for="p in bursts[r.key] ?? []"
          :key="p.id"
          class="burst"
          :style="{ '--x': p.x + 'px', '--y': p.y + 'px' }"
        />
      </span>
      <span class="relative inline-block min-w-[1ch] overflow-hidden text-[13px] leading-none tabular-nums">
        <Transition name="tick" mode="out-in">
          <span :key="rx.countOf(itemId, r.key)" class="inline-block">{{ rx.countOf(itemId, r.key) }}</span>
        </Transition>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { REACTIONS, type ReactionKey } from '~/composables/useReactions'

const props = withDefaults(defineProps<{ itemId: string; compact?: boolean; size?: number }>(), {
  compact: false,
  size: 18
})

const rx = useReactions()
const toast = useToast()

const list = computed(() => (props.compact ? REACTIONS.filter((r) => r.key === 'suka') : REACTIONS))

const popping = ref<ReactionKey | ''>('')
const bursts = reactive<Record<string, { id: number; x: number; y: number }[]>>({})
let seq = 0

function spawnBurst(key: ReactionKey) {
  const n = 9
  const group = Array.from({ length: n }, (_, i) => {
    const angle = (Math.PI * 2 * i) / n + Math.random() * 0.5
    const dist = 16 + Math.random() * 16
    return { id: ++seq, x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
  })
  bursts[key] = group
  setTimeout(() => {
    if (bursts[key] === group) bursts[key] = []
  }, 800)
}

async function onClick(key: ReactionKey) {
  const wasOn = rx.hasMine(props.itemId, key)
  if (!wasOn) {
    spawnBurst(key)
    popping.value = key
    setTimeout(() => (popping.value = ''), 520)
  }
  const res = await rx.toggle(props.itemId, key)
  if (!res.ok) toast.error('Reaksi belum bisa disimpan. Coba lagi sebentar.')
}
</script>

