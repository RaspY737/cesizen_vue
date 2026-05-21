<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links="[{ text: 'Accueil', to: '/' }, { text: 'Mon tracker', to: '/tracker' }, { text: 'Modifier une entrée' }]" />

    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
        <h1 class="fr-h3 fr-mb-3w">
          Modifier l'entrée
        </h1>

        <DsfrAlert
          type="info"
          description="Vous pouvez modifier les détails de cette entrée ou la supprimer."
          class="fr-mb-3w"
        />

        <DsfrAlert
          v-if="message"
          :type="messageType"
          :description="message"
          closeable
          class="fr-mb-3w"
          @close="message = ''"
        />

        <div v-if="entry">
          <DsfrSelect
            v-model="form.sous_emotion_id"
            label="Sous-émotion"
            :options="subEmotionOptions"
            class="fr-mb-2w"
          />

          <DsfrRange
            v-model="form.intensite"
            :min="1"
            :max="10"
            :label="`Intensité : ${form.intensite}/10`"
            class="fr-mb-2w"
          />

          <DsfrInput
            v-model="form.note"
            label="Note"
            label-visible
            is-textarea
            :rows="3"
            class="fr-mb-3w"
          />

          <DsfrButton
            label="Enregistrer"
            :disabled="loading"
            @click="handleUpdate"
          />
          <DsfrButton
            label="Supprimer"
            secondary
            class="fr-ml-2w"
            @click="handleDelete"
          />
          <DsfrButton
            label="Retour"
            secondary
            class="fr-ml-2w"
            @click="$router.push('/tracker')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/services/api'

const route = useRoute()
const router = useRouter()
const entry = ref(null)
const message = ref('')
const messageType = ref('success')
const loading = ref(false)
const subEmotionOptions = ref([])

const form = reactive({
  sous_emotion_id: '',
  intensite: 5,
  note: '',
})

onMounted(async () => {
  try {
    const data = await api.get(`/tracker/entries/${route.params.id}`)
    entry.value = data.data
    form.sous_emotion_id = String(data.data.sous_emotion_id)
    form.intensite = data.data.intensite
    form.note = data.data.note || ''

    const emotions = await api.get('/emotions')
    const allSubs = []
    for (const emotion of emotions.data) {
      const subsData = await api.get(`/emotions/${emotion.id}/sub-emotions`)
      for (const sub of subsData.data) {
        allSubs.push({ value: String(sub.id), text: `${emotion.emoji} ${sub.nom}` })
      }
    }
    subEmotionOptions.value = allSubs
  } catch {
    message.value = 'Erreur de chargement'
    messageType.value = 'error'
  }
})

async function handleUpdate() {
  loading.value = true
  try {
    await api.put(`/tracker/entries/${route.params.id}`, {
      sous_emotion_id: Number(form.sous_emotion_id),
      intensite: form.intensite,
      note: form.note || null,
    })
    message.value = 'Entrée mise à jour'
    messageType.value = 'success'
  } catch (e) {
    message.value = e.message
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!confirm('Supprimer cette entrée ?')) return
  try {
    await api.delete(`/tracker/entries/${route.params.id}`)
    router.push('/tracker')
  } catch (e) {
    message.value = e.message
    messageType.value = 'error'
  }
}
</script>
