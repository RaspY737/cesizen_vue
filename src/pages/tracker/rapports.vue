<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links="[{ text: 'Accueil', to: '/' }, { text: 'Mon tracker', to: '/tracker' }, { text: 'Rapports' }]" />

    <h1 class="fr-h3 fr-mb-3w">
      Rapports d'émotions
    </h1>

    <div
      v-if="loading"
      class="fr-text--center fr-py-4w"
    >
      Chargement...
    </div>

    <div v-else>
      <!-- Stats highlights -->
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
        <div class="fr-col-6 fr-col-md-3">
          <div class="stat-highlight">
            <div class="stat-highlight__value">
              {{ stats.total_entrees }}
            </div>
            <div class="stat-highlight__label">
              Total entrées
            </div>
          </div>
        </div>
        <div class="fr-col-6 fr-col-md-3">
          <div class="stat-highlight">
            <div class="stat-highlight__value">
              {{ stats.entrees_semaine }}
            </div>
            <div class="stat-highlight__label">
              Cette semaine
            </div>
          </div>
        </div>
        <div class="fr-col-6 fr-col-md-3">
          <div class="stat-highlight">
            <div class="stat-highlight__value">
              {{ stats.intensite_moyenne || '—' }}/10
            </div>
            <div class="stat-highlight__label">
              Intensité moyenne
            </div>
          </div>
        </div>
        <div class="fr-col-6 fr-col-md-3">
          <div class="stat-highlight">
            <div class="stat-highlight__value">
              {{ stats.emotion_dominante || '—' }}
            </div>
            <div class="stat-highlight__label">
              Émotion dominante
            </div>
          </div>
        </div>
      </div>

      <!-- Distribution -->
      <div class="chart-container fr-mb-4w">
        <h2 class="chart-title fr-mb-3w">
          Distribution des émotions
        </h2>

        <p
          v-if="distribution.length === 0"
          class="fr-text--sm"
        >
          Pas assez de données.
        </p>

        <div
          v-else
          class="emotion-dist"
        >
          <div
            v-for="item in distribution"
            :key="item.emotion_base_nom"
            class="emotion-dist__item"
          >
            <span class="emotion-dist__icon">{{ item.emotion_base_emoji }}</span>
            <div class="emotion-dist__bar-container">
              <div
                class="emotion-dist__bar"
                :class="`emotion-dist__bar--${getEmotionClass(item.emotion_base_nom)}`"
                :style="{ width: getPercentage(item.count) + '%' }"
              />
            </div>
            <span class="emotion-dist__value">{{ getPercentage(item.count) }}%</span>
          </div>
        </div>
      </div>

      <!-- Pie chart -->
      <div
        v-if="distribution.length > 0"
        class="chart-container"
      >
        <h2 class="chart-title fr-mb-3w">
          Répartition globale
        </h2>
        <div
          class="pie-chart"
          :style="{ background: pieGradient }"
        />
        <div class="chart-legend">
          <div
            v-for="item in distribution"
            :key="item.emotion_base_nom"
            class="chart-legend__item"
          >
            <span
              class="chart-legend__color"
              :style="{ background: getEmotionColor(item.emotion_base_nom) }"
            />
            {{ item.emotion_base_emoji }} {{ item.emotion_base_nom }} ({{ getPercentage(item.count) }}%)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'

const loading = ref(true)
const distribution = ref([])
const stats = ref({ total_entrees: 0, entrees_semaine: 0, intensite_moyenne: 0, emotion_dominante: null })
const totalEntries = ref(0)

const emotionColors = {
  joie: '#4CAF50',
  colere: '#F44336',
  peur: '#FF9800',
  tristesse: '#2196F3',
  surprise: '#9C27B0',
  degout: '#607D8B',
}

function getEmotionClass(name) {
  const n = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (n.includes('joie')) return 'joie'
  if (n.includes('colere')) return 'colere'
  if (n.includes('peur')) return 'peur'
  if (n.includes('tristesse')) return 'tristesse'
  if (n.includes('surprise')) return 'surprise'
  if (n.includes('degout')) return 'degout'
  return 'joie'
}

function getEmotionColor(name) {
  return emotionColors[getEmotionClass(name)] || '#4CAF50'
}

function getPercentage(count) {
  if (totalEntries.value === 0) return 0
  return Math.round((count / totalEntries.value) * 100)
}

const pieGradient = computed(() => {
  if (distribution.value.length === 0) return '#eee'
  let cumulative = 0
  const stops = []
  for (const item of distribution.value) {
    const pct = getPercentage(item.count)
    const color = getEmotionColor(item.emotion_base_nom)
    stops.push(`${color} ${cumulative}% ${cumulative + pct}%`)
    cumulative += pct
  }
  if (cumulative < 100) {
    stops.push(`#eee ${cumulative}% 100%`)
  }
  return `conic-gradient(${stops.join(', ')})`
})

onMounted(async () => {
  try {
    const [distData, statsData] = await Promise.all([
      api.get('/reports/distribution'),
      api.get('/tracker/stats'),
    ])
    distribution.value = distData.data
    stats.value = statsData.data
    totalEntries.value = distribution.value.reduce((sum, d) => sum + d.count, 0)
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
})
</script>
