<template>
  <AdminLayout>
    <div class="fr-grid-row fr-grid-row--middle fr-mb-3w">
      <div class="fr-col">
        <h1 class="fr-h3 fr-mb-0">
          Configuration des émotions
        </h1>
      </div>
      <div class="fr-col-auto">
        <DsfrButton
          label="Ajouter une émotion"
          icon="ri-add-line"
          @click="showAddEmotion = true"
        />
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

    <!-- Formulaire ajout émotion -->
    <div
      v-if="showAddEmotion"
      class="fr-card fr-p-3w fr-mb-3w"
    >
      <h2 class="fr-h5 fr-mb-2w">
        Nouvelle émotion de base
      </h2>
      <form @submit.prevent="addEmotion">
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-4">
            <DsfrInput
              v-model="newEmotion.nom"
              label="Nom"
              label-visible
              required
            />
          </div>
          <div class="fr-col-12 fr-col-md-4">
            <DsfrInput
              v-model="newEmotion.emoji"
              label="Emoji"
              label-visible
            />
          </div>
          <div class="fr-col-12 fr-col-md-4">
            <DsfrInput
              v-model="newEmotion.couleur"
              label="Couleur (hex)"
              label-visible
              placeholder="#FF0000"
            />
          </div>
        </div>
        <DsfrButton
          type="submit"
          label="Ajouter"
          class="fr-mt-2w"
        />
        <DsfrButton
          label="Annuler"
          secondary
          class="fr-ml-2w fr-mt-2w"
          @click="showAddEmotion = false"
        />
      </form>
    </div>

    <!-- Liste des émotions -->
    <DsfrAccordionsGroup v-model="expandedAccordion">
      <DsfrAccordion
        v-for="emotion in emotions"
        :key="emotion.id"
        :title="`${emotion.emoji || ''} ${emotion.nom} (${emotion.sous_emotions.length} sous-émotions)`"
      >
        <div class="fr-mb-2w">
          <DsfrBadge
            :label="emotion.couleur || 'Pas de couleur'"
            :style="{ backgroundColor: emotion.couleur, color: '#fff' }"
          />
          <DsfrButton
            label="Supprimer l'émotion"
            secondary
            size="sm"
            class="fr-ml-2w"
            @click="deleteEmotion(emotion.id)"
          />
        </div>

        <h3 class="fr-h6 fr-mb-1w">
          Sous-émotions
        </h3>
        <ul class="fr-mb-2w">
          <li
            v-for="sub in emotion.sous_emotions"
            :key="sub.id"
          >
            {{ sub.nom }}
            <a
              href="#"
              class="fr-link fr-text--sm fr-ml-1w"
              @click.prevent="deleteSub(sub.id)"
            >supprimer</a>
          </li>
        </ul>

        <form
          class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle"
          @submit.prevent="addSub(emotion.id)"
        >
          <div class="fr-col">
            <DsfrInput
              v-model="newSubName"
              label="Nouvelle sous-émotion"
              label-visible
              placeholder="Nom de la sous-émotion"
            />
          </div>
          <div class="fr-col-auto">
            <DsfrButton
              type="submit"
              label="Ajouter"
              size="sm"
            />
          </div>
        </form>
      </DsfrAccordion>
    </DsfrAccordionsGroup>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { api } from '@/services/api'
import AdminLayout from '@/components/AdminLayout.vue'

const emotions = ref([])
const message = ref('')
const messageType = ref('success')
const showAddEmotion = ref(false)
const newSubName = ref('')
const expandedAccordion = ref(-1)

const newEmotion = reactive({ nom: '', emoji: '', couleur: '' })

async function loadEmotions() {
  try {
    const data = await api.get('/admin/emotions')
    emotions.value = data.data
  } catch {
    emotions.value = []
  }
}

async function addEmotion() {
  try {
    await api.post('/admin/emotions', {
      nom: newEmotion.nom,
      emoji: newEmotion.emoji || null,
      couleur: newEmotion.couleur || null,
    })
    newEmotion.nom = ''
    newEmotion.emoji = ''
    newEmotion.couleur = ''
    showAddEmotion.value = false
    await loadEmotions()
    message.value = 'Émotion ajoutée'
    messageType.value = 'success'
  } catch (e) {
    message.value = e.message
    messageType.value = 'error'
  }
}

async function deleteEmotion(id) {
  if (!confirm('Supprimer cette émotion et toutes ses sous-émotions ?')) return
  try {
    await api.delete(`/admin/emotions/${id}`)
    await loadEmotions()
    message.value = 'Émotion supprimée'
    messageType.value = 'success'
  } catch (e) {
    message.value = e.message
    messageType.value = 'error'
  }
}

async function addSub(emotionId) {
  if (!newSubName.value) return
  try {
    await api.post(`/admin/emotions/${emotionId}/sub-emotions`, { nom: newSubName.value })
    newSubName.value = ''
    await loadEmotions()
  } catch (e) {
    message.value = e.message
    messageType.value = 'error'
  }
}

async function deleteSub(id) {
  try {
    await api.delete(`/admin/sub-emotions/${id}`)
    await loadEmotions()
  } catch (e) {
    message.value = e.message
    messageType.value = 'error'
  }
}

onMounted(loadEmotions)
</script>
