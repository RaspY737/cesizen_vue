<template>
  <div class="fr-container fr-py-8w">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-8 fr-col-lg-6 fr-text--center">
        <h1 class="fr-display--xl fr-mb-1w">
          {{ code }}
        </h1>
        <p class="fr-h3 fr-mb-3w">
          {{ title }}
        </p>
        <p class="fr-text--lg fr-mb-4w">
          {{ description }}
        </p>
        <DsfrButton
          label="Retour à l'accueil"
          icon="ri-home-line"
          @click="$router.push('/')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const code = computed(() => route.query.code || '500')

const errors = {
  403: {
    title: 'Accès interdit',
    description: 'Vous n\'avez pas les droits nécessaires pour accéder à cette page.',
  },
  500: {
    title: 'Erreur serveur',
    description: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
  },
}

const title = computed(() => errors[code.value]?.title || 'Erreur')
const description = computed(() => errors[code.value]?.description || 'Une erreur est survenue.')
</script>
