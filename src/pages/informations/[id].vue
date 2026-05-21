<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links="breadcrumbLinks" />

    <div
      v-if="loading"
      class="fr-text--center fr-py-4w"
    >
      Chargement...
    </div>

    <article v-else-if="page">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-8">
          <div class="fr-mb-2w">
            <DsfrBadge
              v-if="page.categorie_nom"
              :label="page.categorie_nom"
              type="info"
            />
          </div>

          <h1 class="fr-h2 fr-mb-2w">
            {{ page.titre }}
          </h1>

          <p class="fr-text--sm fr-text--alt fr-mb-4w">
            Publié le {{ formatDate(page.date_creation) }}
          </p>

          <!-- eslint-disable vue/no-v-html -->
          <div
            class="fr-text--lg markdown-content"
            v-html="renderedContent"
          />
        </div>

        <div class="fr-col-12 fr-col-md-4">
          <div class="fr-callout">
            <h3 class="fr-callout__title">
              Besoin d'aide ?
            </h3>
            <p class="fr-callout__text">
              Si vous traversez une période difficile, n'hésitez pas à consulter un professionnel de santé.
            </p>
            <router-link
              to="/informations"
              class="fr-btn fr-btn--secondary"
            >
              Voir tous les articles
            </router-link>
          </div>
        </div>
      </div>
    </article>

    <div v-else>
      <p>Article non trouvé.</p>
    </div>

    <div class="fr-mt-4w">
      <router-link
        to="/informations"
        class="fr-link fr-link--icon-left fr-icon-arrow-left-line"
      >
        Retour aux articles
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { api } from '@/services/api'

const route = useRoute()
const page = ref(null)
const loading = ref(true)

const breadcrumbLinks = computed(() => [
  { text: 'Accueil', to: '/' },
  { text: 'Informations', to: '/informations' },
  { text: page.value?.titre || 'Article' },
])

const renderedContent = computed(() => {
  if (!page.value?.contenu) return ''
  return marked.parse(page.value.contenu)
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

onMounted(async () => {
  try {
    const data = await api.get(`/information/pages/${route.params.id}`)
    page.value = data.data
  } catch {
    page.value = null
  } finally {
    loading.value = false
  }
})
</script>
