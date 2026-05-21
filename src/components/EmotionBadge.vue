<template>
  <span
    class="emotion-badge"
    :class="`emotion-badge--${emotionClass}`"
  >
    {{ emoji }} {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  emotion: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
})

const emotionClass = computed(() => {
  const name = props.emotion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (name.includes('joie')) return 'joie'
  if (name.includes('colere')) return 'colere'
  if (name.includes('peur')) return 'peur'
  if (name.includes('tristesse')) return 'tristesse'
  if (name.includes('surprise')) return 'surprise'
  if (name.includes('degout')) return 'degout'
  return 'joie'
})
</script>
