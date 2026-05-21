<template>
  <AdminLayout>
    <h1 class="fr-h3 fr-mb-3w">
      Modifier l'utilisateur
    </h1>

    <DsfrAlert
      v-if="message"
      :type="messageType"
      :description="message"
      closeable
      class="fr-mb-3w"
      @close="message = ''"
    />

    <div
      v-if="user"
      class="fr-grid-row fr-grid-row--center"
    >
      <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
        <div class="section-card">
          <DsfrInput
            v-model="form.prenom"
            label="Prénom"
            label-visible
            class="fr-mb-2w"
          />
          <DsfrInput
            v-model="form.nom"
            label="Nom"
            label-visible
            class="fr-mb-2w"
          />
          <DsfrInput
            v-model="form.email"
            label="Email"
            label-visible
            type="email"
            class="fr-mb-2w"
          />
          <DsfrSelect
            v-model="form.role_id"
            label="Rôle"
            :options="roleOptions"
            class="fr-mb-2w"
          />
          <div class="fr-checkbox-group fr-mb-3w">
            <input
              id="est-actif"
              v-model="form.est_actif"
              type="checkbox"
            >
            <label
              class="fr-label"
              for="est-actif"
            >Compte actif</label>
          </div>
          <DsfrButton
            label="Enregistrer"
            @click="handleSave"
          />
          <DsfrButton
            label="Retour"
            secondary
            class="fr-ml-2w"
            @click="$router.push('/admin/utilisateurs')"
          />
          <DsfrButton
            label="Supprimer"
            class="fr-ml-2w"
            :style="{ backgroundColor: 'var(--error-425-625)', color: '#fff' }"
            :disabled="!canDelete"
            :title="deleteHint"
            @click="handleDelete"
          />
          <p
            v-if="!canDelete"
            class="fr-hint-text fr-mt-1w"
          >
            {{ deleteHint }}
          </p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/services/api'
import AdminLayout from '@/components/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const user = ref(null)
const message = ref('')
const messageType = ref('success')

const form = reactive({
  prenom: '',
  nom: '',
  email: '',
  role_id: '',
  est_actif: true,
})

const roleOptions = [
  { value: '1', text: 'Utilisateur' },
  { value: '2', text: 'Administrateur' },
]

onMounted(async () => {
  try {
    const data = await api.get(`/admin/users/${route.params.id}`)
    user.value = data.data
    form.prenom = data.data.prenom
    form.nom = data.data.nom
    form.email = data.data.email
    form.role_id = String(data.data.role_id)
    form.est_actif = data.data.est_actif
  } catch {
    message.value = 'Erreur de chargement'
    messageType.value = 'error'
  }
})

const DELETION_GRACE_DAYS = 30

const daysSinceDeactivation = computed(() => {
  if (!user.value?.date_desactivation) return null
  const deactivatedAt = new Date(user.value.date_desactivation)
  const diffMs = Date.now() - deactivatedAt.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
})

const canDelete = computed(() => {
  if (!user.value) return false
  if (user.value.est_actif) return false
  return daysSinceDeactivation.value !== null
    && daysSinceDeactivation.value >= DELETION_GRACE_DAYS
})

const deleteHint = computed(() => {
  if (!user.value) return ''
  if (user.value.est_actif) return 'Désactivez d\'abord le compte avant de le supprimer'
  if (daysSinceDeactivation.value === null) {
    return `Le compte doit être désactivé depuis au moins ${DELETION_GRACE_DAYS} jours`
  }
  const remaining = DELETION_GRACE_DAYS - daysSinceDeactivation.value
  if (remaining > 0) return `Suppression possible dans ${remaining} jour${remaining > 1 ? 's' : ''}`
  return ''
})

async function handleDelete() {
  if (!confirm('Supprimer définitivement cet utilisateur et toutes ses données ? Cette action est irréversible.')) return
  try {
    await api.delete(`/admin/users/${route.params.id}`)
    router.push('/admin/utilisateurs')
  } catch (e) {
    message.value = e.message
    messageType.value = 'error'
  }
}

async function handleSave() {
  try {
    await api.put(`/admin/users/${route.params.id}`, {
      prenom: form.prenom,
      nom: form.nom,
      email: form.email,
      role_id: Number(form.role_id),
    })
    await api.patch(`/admin/users/${route.params.id}/status`, {
      est_actif: form.est_actif,
    })
    message.value = 'Utilisateur mis à jour'
    messageType.value = 'success'
  } catch (e) {
    message.value = e.message
    messageType.value = 'error'
  }
}
</script>
