<template>
  <div
    class="intensity-bar"
    :title="`${intensity}/10`"
  >
    <span
      v-for="i in 10"
      :key="i"
      class="intensity-bar__segment"
      :class="{ active: i <= intensity }"
    />
    <span class="fr-text--sm fr-ml-1w">{{ intensity }}/10</span>
  </div>
</template>

<script setup>
defineProps({
  intensity: {
    type: Number,
    required: true,
  },
})
</script>
