<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links="[{ text: 'Accueil', to: '/' }, { text: 'Créer un compte' }]" />

    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
        <h1 class="fr-h3 fr-mb-3w">
          Créer un compte
        </h1>

        <DsfrAlert
          type="info"
          title="Protection de vos données"
          description="Vos données personnelles sont protégées conformément au RGPD. Elles ne seront pas partagées avec des tiers."
          class="fr-mb-3w"
        />

        <DsfrAlert
          v-if="error"
          type="error"
          :description="error"
          closeable
          class="fr-mb-3w"
          @close="error = ''"
        />

        <form @submit.prevent="handleRegister">
          <DsfrInput
            v-model="form.prenom"
            label="Prénom"
            label-visible
            required
            class="fr-mb-2w"
          />

          <DsfrInput
            v-model="form.nom"
            label="Nom"
            label-visible
            required
            class="fr-mb-2w"
          />

          <DsfrInput
            v-model="form.email"
            label="Adresse email"
            label-visible
            type="email"
            placeholder="votre@email.fr"
            required
            class="fr-mb-2w"
          />

          <DsfrInput
            v-model="form.mot_de_passe"
            label="Mot de passe"
            label-visible
            type="password"
            placeholder="Minimum 8 caractères"
            required
            class="fr-mb-1w"
          />

          <p class="fr-hint-text fr-mb-2w">
            Minimum 8 caractères
          </p>

          <DsfrInput
            v-model="form.confirmation"
            label="Confirmer le mot de passe"
            label-visible
            type="password"
            required
            class="fr-mb-3w"
          />

          <DsfrButton
            type="submit"
            label="Créer mon compte"
            :disabled="loading"
          />
        </form>

        <p class="fr-mt-3w fr-text--sm">
          Déjà un compte ?
          <router-link
            to="/auth/connexion"
            class="fr-link"
          >
            Se connecter
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  prenom: '',
  nom: '',
  email: '',
  mot_de_passe: '',
  confirmation: '',
})
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''

  if (form.mot_de_passe !== form.confirmation) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (form.mot_de_passe.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }

  loading.value = true
  try {
    await authStore.register({
      prenom: form.prenom,
      nom: form.nom,
      email: form.email,
      mot_de_passe: form.mot_de_passe,
    })
    router.push('/')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
