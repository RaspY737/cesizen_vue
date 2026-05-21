<template>
  <AdminLayout>
    <div class="fr-grid-row fr-grid-row--middle fr-mb-3w">
      <div class="fr-col">
        <h1 class="fr-h3 fr-mb-0">
          Gestion des contenus
        </h1>
      </div>
      <div class="fr-col-auto">
        <DsfrButton
          label="Nouveau contenu"
          icon="ri-add-line"
          @click="$router.push('/admin/contenus/creer')"
        />
      </div>
    </div>

    <div
      v-if="pages.length === 0"
      class="fr-text--center fr-py-3w"
    >
      <p>Aucun contenu.</p>
    </div>

    <div
      v-else
      class="fr-table fr-table--no-caption"
    >
      <div class="fr-table__wrapper">
        <div class="fr-table__container">
          <div class="fr-table__content">
            <table>
              <caption>Liste des contenus</caption>
              <thead>
                <tr>
                  <th scope="col">
                    Titre
                  </th>
                  <th scope="col">
                    Catégorie
                  </th>
                  <th scope="col">
                    Statut
                  </th>
                  <th scope="col">
                    Date
                  </th>
                  <th scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="page in pages"
                  :key="page.id"
                >
                  <td>{{ page.titre }}</td>
                  <td>{{ page.categorie_nom }}</td>
                  <td>
                    <span
                      class="status-badge"
                      :class="page.est_publiee ? 'status-badge--publie' : 'status-badge--brouillon'"
                    >
                      {{ page.est_publiee ? 'Publié' : 'Brouillon' }}
                    </span>
                  </td>
                  <td>{{ formatDate(page.date_creation) }}</td>
                  <td>
                    <router-link
                      :to="`/admin/contenus/${page.id}`"
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
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import AdminLayout from '@/components/AdminLayout.vue'

const pages = ref([])

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

onMounted(async () => {
  try {
    const data = await api.get('/admin/contents')
    pages.value = data.data.pages
  } catch {
    // ignore
  }
})
</script>
