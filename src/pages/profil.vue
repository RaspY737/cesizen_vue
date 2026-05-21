<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links="[{ text: 'Accueil', to: '/' }, { text: 'Mon profil' }]" />

    <!-- Profile Header -->
    <div class="profile-header fr-mb-4w">
      <div class="profile-avatar">
        {{ initials }}
      </div>
      <div>
        <h1 class="fr-h3 fr-mb-0">
          {{ profile.prenom }} {{ profile.nom }}
        </h1>
        <p class="fr-text--sm fr-mb-0">
          {{ profile.email }}
        </p>
      </div>
    </div>

    <DsfrAlert
      v-if="message"
      :type="messageType"
      :description="message"
      closeable
      class="fr-mb-3w"
      @close="message = ''"
    />

    <!-- Personal info -->
    <div
      id="info"
      class="section-card"
    >
      <div class="fr-grid-row fr-grid-row--middle fr-mb-2w">
        <div class="fr-col">
          <h2 class="fr-h5 fr-mb-0">
            Informations personnelles
          </h2>
        </div>
        <div class="fr-col-auto">
          <DsfrButton
            label="Modifier"
            secondary
            size="sm"
            @click="editMode = !editMode"
          />
        </div>
      </div>

      <div v-if="!editMode">
        <div class="data-row">
          <span class="data-row__label">Prénom</span>
          <span class="data-row__value">{{ profile.prenom }}</span>
        </div>
        <div class="data-row">
          <span class="data-row__label">Nom</span>
          <span class="data-row__value">{{ profile.nom }}</span>
        </div>
        <div class="data-row">
          <span class="data-row__label">Email</span>
          <span class="data-row__value">{{ profile.email }}</span>
        </div>
      </div>

      <form
        v-else
        @submit.prevent="updateProfile"
      >
        <DsfrInput
          v-model="profile.prenom"
          label="Prénom"
          label-visible
          class="fr-mb-2w"
        />
        <DsfrInput
          v-model="profile.nom"
          label="Nom"
          label-visible
          class="fr-mb-2w"
        />
        <DsfrInput
          v-model="profile.email"
          label="Email"
          label-visible
          type="email"
          disabled
          class="fr-mb-3w"
        />
        <DsfrButton
          type="submit"
          label="Enregistrer"
        />
        <DsfrButton
          label="Annuler"
          secondary
          class="fr-ml-2w"
          @click="editMode = false"
        />
      </form>
    </div>

    <!-- Password -->
    <div
      id="securite"
      class="section-card"
    >
      <h2 class="fr-h5 fr-mb-2w">
        Sécurité
      </h2>
      <form @submit.prevent="changePassword">
        <DsfrInput
          v-model="passwords.ancien"
          label="Mot de passe actuel"
          label-visible
          type="password"
          class="fr-mb-2w"
        />
        <DsfrInput
          v-model="passwords.nouveau"
          label="Nouveau mot de passe"
          label-visible
          type="password"
          class="fr-mb-2w"
        />
        <DsfrInput
          v-model="passwords.confirmation"
          label="Confirmer le nouveau mot de passe"
          label-visible
          type="password"
          class="fr-mb-3w"
        />
        <DsfrButton
          type="submit"
          label="Changer le mot de passe"
          secondary
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'

const authStore = useAuthStore()
const message = ref('')
const messageType = ref('success')
const editMode = ref(false)

const profile = reactive({
  prenom: '',
  nom: '',
  email: '',
})

const passwords = reactive({
  ancien: '',
  nouveau: '',
  confirmation: '',
})

const initials = computed(() => {
  const p = profile.prenom ? profile.prenom[0] : ''
  const n = profile.nom ? profile.nom[0] : ''
  return (p + n).toUpperCase()
})

onMounted(async () => {
  await authStore.fetchProfile()
  if (authStore.user) {
    profile.prenom = authStore.user.prenom
    profile.nom = authStore.user.nom
    profile.email = authStore.user.email
  }
})

async function updateProfile() {
  try {
    await api.put('/users/me', { nom: profile.nom, prenom: profile.prenom })
    await authStore.fetchProfile()
    editMode.value = false
    message.value = 'Profil mis à jour avec succès'
    messageType.value = 'success'
  } catch (e) {
    message.value = e.message
    messageType.value = 'error'
  }
}

async function changePassword() {
  if (passwords.nouveau !== passwords.confirmation) {
    message.value = 'Les mots de passe ne correspondent pas'
    messageType.value = 'error'
    return
  }
  try {
    await api.put('/users/me/password', {
      ancien_mot_de_passe: passwords.ancien,
      nouveau_mot_de_passe: passwords.nouveau,
    })
    passwords.ancien = ''
    passwords.nouveau = ''
    passwords.confirmation = ''
    message.value = 'Mot de passe modifié avec succès'
    messageType.value = 'success'
  } catch (e) {
    message.value = e.message
    messageType.value = 'error'
  }
}
</script>
