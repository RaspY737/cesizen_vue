<template>
  <AdminLayout>
    <div class="fr-grid-row fr-grid-row--middle fr-mb-3w">
      <div class="fr-col">
        <h1 class="fr-h3 fr-mb-0">
          Gestion des utilisateurs
        </h1>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar fr-mb-3w">
      <div
        class="fr-input-group"
        style="flex: 1; min-width: 200px;"
      >
        <label
          class="fr-label"
          for="search-user"
        >Rechercher</label>
        <input
          id="search-user"
          v-model="searchQuery"
          class="fr-input"
          type="text"
          placeholder="Nom ou email..."
        >
      </div>
    </div>

    <div
      v-if="filteredUsers.length === 0"
      class="fr-text--center fr-py-3w"
    >
      <p>Aucun utilisateur trouvé.</p>
    </div>

    <div
      v-else
      class="fr-table fr-table--no-caption"
    >
      <div class="fr-table__wrapper">
        <div class="fr-table__container">
          <div class="fr-table__content">
            <table>
              <caption>Liste des utilisateurs</caption>
              <thead>
                <tr>
                  <th scope="col">
                    Nom
                  </th>
                  <th scope="col">
                    Email
                  </th>
                  <th scope="col">
                    Rôle
                  </th>
                  <th scope="col">
                    Statut
                  </th>
                  <th scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in filteredUsers"
                  :key="user.id"
                >
                  <td>{{ user.prenom }} {{ user.nom }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span
                      class="status-badge"
                      :class="user.role_nom === 'administrateur' ? 'status-badge--attente' : ''"
                    >
                      {{ user.role_nom === 'administrateur' ? 'Admin' : 'Utilisateur' }}
                    </span>
                  </td>
                  <td>
                    <span
                      class="status-badge"
                      :class="user.est_actif ? 'status-badge--actif' : 'status-badge--inactif'"
                    >
                      {{ user.est_actif ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td>
                    <router-link
                      :to="`/admin/utilisateurs/${user.id}`"
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
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'
import AdminLayout from '@/components/AdminLayout.vue'

const users = ref([])
const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u =>
    u.nom.toLowerCase().includes(q) ||
    u.prenom.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  try {
    const data = await api.get('/admin/users')
    users.value = data.data.users
  } catch {
    // ignore
  }
})
</script>
