<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links="[{ text: 'Accueil', to: '/' }, { text: 'Mon tracker', to: '/tracker' }, { text: 'Historique' }]" />

    <h1 class="fr-h3 fr-mb-3w">
      Historique des émotions
    </h1>

    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3w">
      <div class="fr-col-12 fr-col-md-4">
        <DsfrSelect
          v-model="period"
          label="Période"
          :options="periodOptions"
          default-unselected-text="Toutes"
        />
      </div>
      <div class="fr-col-12 fr-col-md-4">
        <DsfrSelect
          v-model="emotionFilter"
          label="Émotion"
          :options="emotionOptions"
          default-unselected-text="Toutes les émotions"
        />
      </div>
    </div>

    <div
      v-if="entries.length === 0"
      class="fr-text--center fr-py-3w"
    >
      <p>Aucune entrée pour cette période.</p>
    </div>

    <div
      v-else
      class="fr-table fr-table--no-caption"
    >
      <div class="fr-table__wrapper">
        <div class="fr-table__container">
          <div class="fr-table__content">
            <table>
              <caption>Historique des émotions</caption>
              <thead>
                <tr>
                  <th scope="col">
                    Date
                  </th>
                  <th scope="col">
                    Émotion
                  </th>
                  <th scope="col">
                    Sous-émotion
                  </th>
                  <th scope="col">
                    Intensité
                  </th>
                  <th scope="col">
                    Note
                  </th>
                  <th scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="entry in entries"
                  :key="entry.id"
                >
                  <td>{{ formatDate(entry.date_entree) }}</td>
                  <td>
                    <EmotionBadge
                      :emotion="entry.emotion_base_nom"
                      :emoji="entry.emotion_base_emoji"
                      :label="entry.emotion_base_nom"
                    />
                  </td>
                  <td>{{ entry.sous_emotion_nom }}</td>
                  <td><IntensityBar :intensity="entry.intensite" /></td>
                  <td class="fr-text--sm">
                    {{ entry.note || '—' }}
                  </td>
                  <td>
                    <router-link
                      :to="`/tracker/${entry.id}`"
                      class="fr-btn fr-btn--tertiary fr-btn--sm"
                    >
                      Modifier
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { api } from '@/services/api'
import EmotionBadge from '@/components/EmotionBadge.vue'
import IntensityBar from '@/components/IntensityBar.vue'

const entries = ref([])
const period = ref('')
const emotionFilter = ref('')
const emotionOptions = ref([])

const periodOptions = [
  { value: 'week', text: 'Cette semaine' },
  { value: 'month', text: 'Ce mois' },
  { value: 'quarter', text: 'Ce trimestre' },
  { value: 'year', text: 'Cette année' },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function loadEntries() {
  try {
    const params = new URLSearchParams()
    if (period.value) params.set('period', period.value)
    if (emotionFilter.value) params.set('emotion_base_id', emotionFilter.value)
    params.set('limit', '50')
    const data = await api.get(`/tracker/entries?${params.toString()}`)
    entries.value = data.data
  } catch {
    entries.value = []
  }
}

watch([period, emotionFilter], loadEntries)

onMounted(async () => {
  try {
    const emotionsData = await api.get('/emotions')
    emotionOptions.value = emotionsData.data.map(e => ({
      value: String(e.id),
      text: `${e.emoji} ${e.nom}`,
    }))
  } catch {
    // ignore
  }
  await loadEntries()
})
</script>
