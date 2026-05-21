<template>
  <AdminLayout>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-8">
        <h1 class="fr-h3 fr-mb-3w">
          Nouveau contenu
        </h1>

        <DsfrAlert
          v-if="error"
          type="error"
          :description="error"
          closeable
          class="fr-mb-3w"
          @close="error = ''"
        />

        <form @submit.prevent="handleSubmit">
          <DsfrInput
            v-model="form.titre"
            label="Titre"
            label-visible
            required
            class="fr-mb-2w"
          />

          <DsfrInput
            v-model="form.resume"
            label="Résumé"
            label-visible
            class="fr-mb-2w"
          />

          <DsfrSelect
            v-model="form.categorie_id"
            label="Catégorie"
            :options="categoryOptions"
            default-unselected-text="Sélectionnez une catégorie"
            class="fr-mb-2w"
          />

          <DsfrInput
            v-model="form.contenu"
            label="Contenu (Markdown supporté)"
            label-visible
            is-textarea
            :rows="12"
            required
            class="fr-mb-2w"
          />

          <div
            v-if="form.contenu"
            class="fr-mb-2w"
          >
            <button
              type="button"
              class="fr-btn fr-btn--tertiary fr-btn--sm fr-mb-1w"
              @click="showPreview = !showPreview"
            >
              {{ showPreview ? 'Masquer' : 'Aperçu' }} Markdown
            </button>
            <!-- eslint-disable vue/no-v-html -->
            <div
              v-if="showPreview"
              class="fr-card fr-p-3w markdown-content"
              v-html="renderedContent"
            />
          </div>

          <div class="fr-mb-3w">
            <label class="fr-label">
              <input
                v-model="form.est_publiee"
                type="checkbox"
                class="fr-mr-1w"
              >
              Publier immédiatement
            </label>
          </div>

          <DsfrButton
            type="submit"
            label="Enregistrer"
            :disabled="loading"
          />
          <DsfrButton
            label="Annuler"
            secondary
            class="fr-ml-2w"
            @click="$router.push('/admin/contenus')"
          />
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { marked } from 'marked'
import { api } from '@/services/api'
import AdminLayout from '@/components/AdminLayout.vue'

const router = useRouter()
const error = ref('')
const loading = ref(false)
const showPreview = ref(false)
const renderedContent = computed(() => marked.parse(form.contenu || ''))
const categoryOptions = ref([])

const form = reactive({
  titre: '',
  contenu: '',
  resume: '',
  categorie_id: '',
  est_publiee: false,
})

onMounted(async () => {
  try {
    const data = await api.get('/information/categories')
    categoryOptions.value = data.data.map(c => ({ value: String(c.id), text: c.nom }))
  } catch {
    // ignore
  }
})

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    await api.post('/admin/contents', {
      titre: form.titre,
      contenu: form.contenu,
      resume: form.resume || null,
      categorie_id: form.categorie_id ? Number(form.categorie_id) : null,
      est_publiee: form.est_publiee,
    })
    router.push('/admin/contenus')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
