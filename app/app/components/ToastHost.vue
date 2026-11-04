<template>
  <Teleport to="body">
    <TransitionGroup
      name="toast"
      tag="div"
      class="pointer-events-none fixed inset-x-4 bottom-4 z-[58] flex flex-col items-end sm:inset-x-auto sm:bottom-6 sm:right-6 [&>*]:pointer-events-auto"
      aria-live="polite"
    >
      <ToastItem v-for="t in toasts" :key="t.id" :toast="t" @close="dismiss(t.id)" />
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, dismiss } = useToast()
</script>

