<template>
  <AdminLayout>
    <div class="fr-mb-3w">
      <h1 class="fr-h3 fr-mb-1v">
        Tableau de bord
      </h1>
      <p
        class="fr-text--sm"
        style="color: #666;"
      >
        Bienvenue sur l'administration de CESIZen.
      </p>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="admin-stat-card">
        <div class="admin-stat-card__header">
          <div class="admin-stat-card__icon admin-stat-card__icon--users">
            <span
              class="fr-icon-user-fill"
              aria-hidden="true"
            />
          </div>
        </div>
        <div class="admin-stat-card__value">
          {{ stats.total_users }}
        </div>
        <div class="admin-stat-card__label">
          Utilisateurs inscrits
        </div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-card__header">
          <div class="admin-stat-card__icon admin-stat-card__icon--tracker">
            <span
              class="fr-icon-emotion-fill"
              aria-hidden="true"
            />
          </div>
        </div>
        <div class="admin-stat-card__value">
          {{ stats.total_entries }}
        </div>
        <div class="admin-stat-card__label">
          Entrées tracker
        </div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-card__header">
          <div class="admin-stat-card__icon admin-stat-card__icon--content">
            <span
              class="fr-icon-article-fill"
              aria-hidden="true"
            />
          </div>
        </div>
        <div class="admin-stat-card__value">
          {{ stats.total_pages }}
        </div>
        <div class="admin-stat-card__label">
          Articles publiés
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="chart-container fr-mb-3w">
      <h2 class="chart-title fr-mb-2w">
        Actions rapides
      </h2>
      <div class="quick-actions">
        <router-link
          to="/admin/utilisateurs"
          class="quick-action"
        >
          <span
            class="quick-action__icon fr-icon-user-add-line"
            aria-hidden="true"
          />
          <span class="quick-action__text">Gérer les utilisateurs</span>
        </router-link>
        <router-link
          to="/admin/contenus/creer"
          class="quick-action"
        >
          <span
            class="quick-action__icon fr-icon-edit-line"
            aria-hidden="true"
          />
          <span class="quick-action__text">Rédiger un article</span>
        </router-link>
        <router-link
          to="/admin/emotions"
          class="quick-action"
        >
          <span
            class="quick-action__icon fr-icon-settings-5-line"
            aria-hidden="true"
          />
          <span class="quick-action__text">Configurer les émotions</span>
        </router-link>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import AdminLayout from '@/components/AdminLayout.vue'

const stats = ref({ total_users: 0, total_entries: 0, total_pages: 0 })

onMounted(async () => {
  try {
    const data = await api.get('/admin/stats')
    stats.value = data.data
  } catch {
    // ignore
  }
})
</script>
