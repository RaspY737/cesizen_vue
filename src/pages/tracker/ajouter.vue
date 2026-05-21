<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links="[{ text: 'Accueil', to: '/' }, { text: 'Mon tracker', to: '/tracker' }, { text: 'Ajouter une émotion' }]" />

    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
        <!-- Step indicator -->
        <div class="step-indicator">
          <div
            class="step-indicator__step"
            :class="{ active: step === 1, completed: step > 1 }"
          >
            <span class="step-indicator__circle">1</span>
            <span>Émotion</span>
          </div>
          <span class="step-indicator__separator" />
          <div
            class="step-indicator__step"
            :class="{ active: step === 2, completed: step > 2 }"
          >
            <span class="step-indicator__circle">2</span>
            <span>Précision</span>
          </div>
          <span class="step-indicator__separator" />
          <div
            class="step-indicator__step"
            :class="{ active: step === 3 }"
          >
            <span class="step-indicator__circle">3</span>
            <span>Détails</span>
          </div>
        </div>

        <DsfrAlert
          v-if="error"
          type="error"
          :description="error"
          closeable
          class="fr-mb-3w"
          @close="error = ''"
        />

        <!-- Step 1: Base emotion -->
        <div
          v-if="step === 1"
          class="fr-mb-3w"
        >
          <h2 class="fr-h5 fr-mb-2w">
            Comment vous sentez-vous ?
          </h2>
          <div class="fr-grid-row fr-grid-row--gutters">
            <div
              v-for="emotion in emotions"
              :key="emotion.id"
              class="fr-col-6 fr-col-md-4"
            >
              <div
                class="fr-card fr-p-2w fr-text--center emotion-card"
                :style="{ cursor: 'pointer', border: selectedEmotion?.id === emotion.id ? '2px solid #000091' : '' }"
                @click="selectEmotion(emotion)"
              >
                <span style="font-size: 2.5rem;">{{ emotion.emoji }}</span>
                <p class="fr-text--bold fr-mb-0 fr-mt-1w">
                  {{ emotion.nom }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Sub-emotion chips -->
        <div
          v-if="step === 2"
          class="fr-mb-3w"
        >
          <h2 class="fr-h5 fr-mb-2w">
            Plus précisément ?
            <span class="fr-text--regular">({{ selectedEmotion.emoji }} {{ selectedEmotion.nom }})</span>
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            <button
              v-for="sub in subEmotions"
              :key="sub.id"
              class="chip"
              :class="{ selected: form.sous_emotion_id === sub.id }"
              @click="selectSubEmotion(sub)"
            >
              {{ sub.nom }}
            </button>
          </div>
          <DsfrButton
            label="← Retour"
            secondary
            class="fr-mt-2w"
            @click="step = 1"
          />
        </div>

        <!-- Step 3: Intensity + note -->
        <div v-if="step === 3">
          <h2 class="fr-h5 fr-mb-2w">
            {{ selectedEmotion.emoji }} {{ selectedSubEmotion.nom }}
          </h2>

          <DsfrRange
            v-model="form.intensite"
            :min="1"
            :max="10"
            :label="`Intensité : ${form.intensite}/10`"
            class="fr-mb-3w"
          />

          <DsfrInput
            v-model="form.note"
            label="Note personnelle (optionnel)"
            label-visible
            is-textarea
            :rows="3"
            placeholder="Décrivez votre ressenti..."
            class="fr-mb-3w"
          />

          <DsfrButton
            label="Enregistrer"
            :disabled="loading"
            @click="handleSubmit"
          />
          <DsfrButton
            label="← Retour"
            secondary
            class="fr-ml-2w"
            @click="step = 2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'

const router = useRouter()
const step = ref(1)
const error = ref('')
const loading = ref(false)
const emotions = ref([])
const subEmotions = ref([])
const selectedEmotion = ref(null)
const selectedSubEmotion = ref(null)

const form = reactive({
  sous_emotion_id: null,
  intensite: 5,
  note: '',
})

api.get('/emotions').then(data => {
  emotions.value = data.data
}).catch(() => {})

async function selectEmotion(emotion) {
  selectedEmotion.value = emotion
  try {
    const data = await api.get(`/emotions/${emotion.id}/sub-emotions`)
    subEmotions.value = data.data
    step.value = 2
  } catch {
    error.value = 'Erreur de chargement des sous-émotions'
  }
}

function selectSubEmotion(sub) {
  selectedSubEmotion.value = sub
  form.sous_emotion_id = sub.id
  step.value = 3
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    await api.post('/tracker/entries', {
      sous_emotion_id: form.sous_emotion_id,
      intensite: form.intensite,
      note: form.note || null,
    })
    router.push('/tracker')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
