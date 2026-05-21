<template>
  <DsfrHeader
    service-title="CESIZen"
    service-description="L'application de votre santé mentale"
    home-to="/"
    :quick-links="quickLinks"
  >
    <template #mainnav>
      <nav
        class="fr-nav"
        role="navigation"
        aria-label="Menu principal"
      >
        <ul class="fr-nav__list">
          <li class="fr-nav__item">
            <router-link
              to="/"
              class="fr-nav__link"
            >
              Accueil
            </router-link>
          </li>
          <li class="fr-nav__item">
            <router-link
              to="/informations"
              class="fr-nav__link"
            >
              Informations
            </router-link>
          </li>
          <li
            v-if="authStore.isAuthenticated"
            class="fr-nav__item"
          >
            <router-link
              to="/tracker"
              class="fr-nav__link"
            >
              Mon tracker
            </router-link>
          </li>
          <li
            v-if="authStore.isAuthenticated"
            class="fr-nav__item"
          >
            <router-link
              to="/tracker/rapports"
              class="fr-nav__link"
            >
              Mes rapports
            </router-link>
          </li>
          <li
            v-if="authStore.isAdmin"
            class="fr-nav__item"
          >
            <router-link
              to="/admin"
              class="fr-nav__link"
            >
              Administration
            </router-link>
          </li>
        </ul>
      </nav>
    </template>
  </DsfrHeader>

  <DsfrAlert
    v-if="notificationStore.visible"
    :type="notificationStore.type"
    :description="notificationStore.message"
    closeable
    class="fr-container fr-mt-2w"
    @close="notificationStore.hide()"
  />

  <main class="fr-py-4w">
    <router-view />
  </main>

  <DsfrFooter :legal-links="legalLinks" />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

onMounted(() => {
  authStore.fetchProfile()
})

const legalLinks = [
  { label: 'Mentions légales', to: '/mentions-legales' },
  { label: 'Données personnelles', to: '/donnees-personnelles' },
  { label: 'Gestion des cookies', to: '/cookies' },
]

const quickLinks = computed(() => {
  if (authStore.isAuthenticated) {
    return [
      { label: 'Mon profil', to: '/profil', icon: 'ri-user-line' },
      {
        label: 'Déconnexion',
        button: true,
        icon: 'ri-logout-box-line',
        onClick: () => {
          authStore.logout()
          window.location.href = '/'
        },
      },
    ]
  }

  return [
    { label: 'Se connecter', to: '/auth/connexion', icon: 'ri-login-box-line' },
    { label: 'Créer un compte', to: '/auth/inscription' },
  ]
})
</script>
