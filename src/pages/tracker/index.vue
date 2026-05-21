<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links="[{ text: 'Accueil', to: '/' }, { text: 'Mon tracker' }]" />

    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-mb-4w">
      <div class="fr-col">
        <h1>Mon journal d'émotions</h1>
        <p class="fr-text--lead">
          Suivez vos émotions au quotidien et observez leur évolution.
        </p>
      </div>
      <div class="fr-col-auto">
        <DsfrButton
          label="Ajouter une émotion"
          icon="ri-add-line"
          @click="$router.push('/tracker/ajouter')"
        />
      </div>
    </div>

    <!-- Stats tiles -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-6 fr-col-md-3">
        <div class="fr-tile fr-tile--sm">
          <div class="fr-tile__body">
            <div class="fr-tile__content">
              <h3 class="fr-tile__title">
                Cette semaine
              </h3>
              <p class="fr-tile__desc">
                <strong>{{ stats.entrees_semaine }}</strong> entrées
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-col-6 fr-col-md-3">
        <div class="fr-tile fr-tile--sm">
          <div class="fr-tile__body">
            <div class="fr-tile__content">
              <h3 class="fr-tile__title">
                Émotion dominante
              </h3>
              <p class="fr-tile__desc">
                {{ stats.emotion_dominante || '—' }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-col-6 fr-col-md-3">
        <div class="fr-tile fr-tile--sm">
          <div class="fr-tile__body">
            <div class="fr-tile__content">
              <h3 class="fr-tile__title">
                Intensité moyenne
              </h3>
              <p class="fr-tile__desc">
                <strong>{{ stats.intensite_moyenne || '—' }}</strong> / 10
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-col-6 fr-col-md-3">
        <div class="fr-tile fr-tile--sm fr-enlarge-link">
          <div class="fr-tile__body">
            <div class="fr-tile__content">
              <h3 class="fr-tile__title">
                <router-link to="/tracker/rapports">
                  Voir le rapport
                </router-link>
              </h3>
              <p class="fr-tile__desc">
                Analyse détaillée →
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3w">
      <div class="fr-col-12 fr-col-md-4">
        <DsfrSelect
          v-model="filterPeriod"
          label="Période"
          :options="periodOptions"
          default-unselected-text="Toutes les périodes"
        />
      </div>
      <div class="fr-col-12 fr-col-md-4">
        <DsfrSelect
          v-model="filterEmotion"
          label="Émotion"
          :options="emotionOptions"
          default-unselected-text="Toutes les émotions"
        />
      </div>
      <div
        class="fr-col-12 fr-col-md-4"
        style="display:flex;align-items:flex-end;"
      >
        <DsfrButton
          label="Appliquer les filtres"
          secondary
          icon="ri-filter-line"
          @click="loadEntries"
        />
      </div>
    </div>

    <!-- Table -->
    <div
      v-if="entries.length === 0"
      class="fr-text--center fr-py-4w"
    >
      <p>Aucune entrée. Commencez par enregistrer votre première émotion !</p>
    </div>

    <div
      v-else
      class="fr-table fr-table--no-caption"
    >
      <div class="fr-table__wrapper">
        <div class="fr-table__container">
          <div class="fr-table__content">
            <table>
              <caption>Journal des émotions</caption>
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
                  <td>
                    <IntensityBar :intensity="entry.intensite" />
                  </td>
                  <td class="fr-text--sm">
                    {{ entry.note || '—' }}
                  </td>
                  <td>
                    <ul class="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
                      <li>
                        <router-link
                          :to="`/tracker/${entry.id}`"
                          class="fr-btn fr-btn--tertiary fr-btn--sm"
                        >
                          Modifier
                        </router-link>
                      </li>
                      <li>
                        <button
                          class="fr-btn fr-btn--tertiary fr-btn--sm"
                          @click="confirmDelete(entry)"
                        >
                          Supprimer
                        </button>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirmation -->
    <dialog
      ref="deleteDialog"
      class="fr-modal"
      role="dialog"
    >
      <div class="fr-container fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div class="fr-modal__body">
              <div class="fr-modal__header">
                <button
                  class="fr-btn--close fr-btn"
                  @click="$refs.deleteDialog.close()"
                >
                  Fermer
                </button>
              </div>
              <div class="fr-modal__content">
                <h1 class="fr-modal__title">
                  Confirmer la suppression
                </h1>
                <p>Êtes-vous sûr de vouloir supprimer cette entrée de votre journal ? Cette action est irréversible.</p>
              </div>
              <div class="fr-modal__footer">
                <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline">
                  <DsfrButton
                    label="Annuler"
                    secondary
                    @click="$refs.deleteDialog.close()"
                  />
                  <DsfrButton
                    label="Supprimer"
                    @click="handleDelete"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import EmotionBadge from '@/components/EmotionBadge.vue'
import IntensityBar from '@/components/IntensityBar.vue'
const stats = ref({ total_entrees: 0, entrees_semaine: 0, emotion_dominante: null, intensite_moyenne: null })
const entries = ref([])
const filterPeriod = ref('')
const filterEmotion = ref('')
const entryToDelete = ref(null)
const deleteDialog = ref(null)

const periodOptions = [
  { value: 'week', text: 'Cette semaine' },
  { value: 'month', text: 'Ce mois' },
  { value: 'quarter', text: 'Ce trimestre' },
  { value: 'year', text: 'Cette année' },
]

const emotionOptions = ref([])

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function confirmDelete(entry) {
  entryToDelete.value = entry
  deleteDialog.value?.showModal()
}

async function handleDelete() {
  if (!entryToDelete.value) return
  try {
    await api.delete(`/tracker/entries/${entryToDelete.value.id}`)
    deleteDialog.value?.close()
    await loadEntries()
    await loadStats()
  } catch {
    // ignore
  }
}

async function loadEntries() {
  try {
    const params = new URLSearchParams()
    if (filterPeriod.value) params.set('period', filterPeriod.value)
    if (filterEmotion.value) params.set('emotion_base_id', filterEmotion.value)
    params.set('limit', '20')
    const data = await api.get(`/tracker/entries?${params.toString()}`)
    entries.value = data.data
  } catch {
    entries.value = []
  }
}

async function loadStats() {
  try {
    const statsData = await api.get('/tracker/stats')
    stats.value = statsData.data
  } catch {
    // ignore
  }
}

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
  await Promise.all([loadStats(), loadEntries()])
})
</script>
