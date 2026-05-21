<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links="[{ text: 'Accueil', to: '/' }, { text: 'Connexion' }]" />

    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
        <h1 class="fr-h3 fr-mb-3w">
          Connexion
        </h1>

        <DsfrAlert
          v-if="error"
          type="error"
          :description="error"
          closeable
          class="fr-mb-3w"
          @close="error = ''"
        />

        <form @submit.prevent="handleLogin">
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
            placeholder="Votre mot de passe"
            required
            class="fr-mb-1w"
          />

          <p class="fr-mb-3w">
            <a
              href="#"
              class="fr-link fr-text--sm"
            >Mot de passe oublié ?</a>
          </p>

          <DsfrButton
            type="submit"
            label="Se connecter"
            :disabled="loading"
          />
        </form>

        <p class="fr-mt-3w fr-text--sm">
          Pas encore de compte ?
          <router-link
            to="/auth/inscription"
            class="fr-link"
          >
            Créer un compte
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

const form = reactive({ email: '', mot_de_passe: '' })
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(form.email, form.mot_de_passe)
    router.push('/')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
