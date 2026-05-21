<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links="[{ text: 'Accueil', to: '/' }, { text: 'Informations' }]" />

    <h1 class="fr-h3 fr-mb-3w">
      Informations santé mentale
    </h1>

    <!-- Tag filters -->
    <div class="fr-tags-group fr-mb-3w">
      <button
        class="fr-tag"
        :aria-pressed="selectedCategory === ''"
        @click="selectedCategory = ''"
      >
        Tous
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="fr-tag"
        :aria-pressed="selectedCategory === String(cat.id)"
        @click="selectedCategory = selectedCategory === String(cat.id) ? '' : String(cat.id)"
      >
        {{ cat.nom }}
      </button>
    </div>

    <div
      v-if="loading"
      class="fr-text--center fr-py-4w"
    >
      Chargement...
    </div>

    <div
      v-else-if="pages.length === 0"
      class="fr-text--center fr-py-4w"
    >
      <p>Aucun article disponible pour le moment.</p>
    </div>

    <div
      v-else
      class="fr-grid-row fr-grid-row--gutters"
    >
      <div
        v-for="page in pages"
        :key="page.id"
        class="fr-col-12 fr-col-md-6 fr-col-lg-4"
      >
        <div class="fr-card fr-enlarge-link emotion-card">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <h3 class="fr-card__title">
                <router-link :to="`/informations/${page.id}`">
                  {{ page.titre }}
                </router-link>
              </h3>
              <p class="fr-card__desc">
                {{ page.resume || "Lire l'article..." }}
              </p>
              <p class="fr-card__detail">
                {{ page.categorie_nom || '' }}
              </p>
            </div>
          </div>
          <div class="fr-card__header">
            <ul
              v-if="page.categorie_nom"
              class="fr-badges-group"
            >
              <li>
                <p class="fr-badge fr-badge--sm fr-badge--info">
                  {{ page.categorie_nom }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { api } from '@/services/api'

const pages = ref([])
const categories = ref([])
const selectedCategory = ref('')
const loading = ref(true)

async function loadCategories() {
  try {
    const data = await api.get('/information/categories')
    categories.value = data.data
  } catch {
    // ignore
  }
}

async function loadPages() {
  loading.value = true
  try {
    const params = selectedCategory.value ? `?categorie_id=${selectedCategory.value}` : ''
    const data = await api.get(`/information/pages${params}`)
    pages.value = data.data.pages
  } catch {
    pages.value = []
  } finally {
    loading.value = false
  }
}

watch(selectedCategory, () => loadPages())

onMounted(async () => {
  await loadCategories()
  await loadPages()
})
</script>
