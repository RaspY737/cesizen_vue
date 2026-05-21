<template>
  <div>
    <!-- Hero Section -->
    <section class="cesizen-hero">
      <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-12 fr-col-md-7">
            <h1 class="cesizen-hero__title">
              Prenez soin de votre santé mentale
            </h1>
            <p class="fr-text--lead">
              CESIZen vous accompagne au quotidien pour mieux comprendre vos émotions,
              gérer votre stress et améliorer votre bien-être.
            </p>
            <div class="fr-btns-group fr-btns-group--inline-lg">
              <DsfrButton
                v-if="!authStore.isAuthenticated"
                label="Commencer gratuitement"
                size="lg"
                @click="$router.push('/auth/inscription')"
              />
              <DsfrButton
                v-if="!authStore.isAuthenticated"
                label="En savoir plus"
                secondary
                size="lg"
                @click="$router.push('/informations')"
              />
              <DsfrButton
                v-if="authStore.isAuthenticated"
                label="Mon tracker d'émotions"
                size="lg"
                @click="$router.push('/tracker')"
              />
              <DsfrButton
                v-if="authStore.isAuthenticated"
                label="Mes rapports"
                secondary
                size="lg"
                @click="$router.push('/tracker/rapports')"
              />
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-5">
            <div class="fr-callout">
              <p class="fr-callout__title">
                💚 Le saviez-vous ?
              </p>
              <p class="fr-callout__text">
                1 Français sur 5 est touché par un trouble de santé mentale chaque année.
                Prendre conscience de ses émotions est la première étape vers le bien-être.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Fonctionnalités -->
    <section class="fr-py-8w">
      <div class="fr-container">
        <h2 class="fr-mb-4w">
          Nos outils pour votre bien-être
        </h2>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
            <div class="fr-card fr-enlarge-link emotion-card">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <h3 class="fr-card__title">
                    <router-link to="/tracker">
                      Tracker d'émotions
                    </router-link>
                  </h3>
                  <p class="fr-card__desc">
                    Enregistrez vos émotions quotidiennes et suivez leur évolution
                    grâce à un journal de bord personnalisé.
                  </p>
                  <p class="fr-card__detail fr-icon-emotion-line">
                    Module principal
                  </p>
                </div>
              </div>
              <div class="fr-card__header">
                <div class="fr-card__img">
                  <svg
                    viewBox="0 0 200 120"
                    style="width:100%;background:#E8F5E9"
                  >
                    <text
                      x="50%"
                      y="50%"
                      text-anchor="middle"
                      dy=".3em"
                      font-size="40"
                    >😊📊</text>
                  </svg>
                </div>
                <ul class="fr-badges-group">
                  <li>
                    <p class="fr-badge fr-badge--green-emeraude">
                      Connexion requise
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
            <div class="fr-card fr-enlarge-link emotion-card">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <h3 class="fr-card__title">
                    <router-link to="/informations">
                      Informations
                    </router-link>
                  </h3>
                  <p class="fr-card__desc">
                    Découvrez des ressources fiables sur la santé mentale,
                    le stress et les moyens de prendre soin de vous.
                  </p>
                  <p class="fr-card__detail fr-icon-article-line">
                    Articles et guides
                  </p>
                </div>
              </div>
              <div class="fr-card__header">
                <div class="fr-card__img">
                  <svg
                    viewBox="0 0 200 120"
                    style="width:100%;background:#FFF3E0"
                  >
                    <text
                      x="50%"
                      y="50%"
                      text-anchor="middle"
                      dy=".3em"
                      font-size="40"
                    >📚💡</text>
                  </svg>
                </div>
                <ul class="fr-badges-group">
                  <li>
                    <p class="fr-badge fr-badge--info">
                      Accès libre
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
            <div class="fr-card fr-enlarge-link emotion-card">
              <div class="fr-card__body">
                <div class="fr-card__content">
                  <h3 class="fr-card__title">
                    <router-link :to="authStore.isAuthenticated ? '/tracker/rapports' : '/auth/connexion'">
                      Rapports & Statistiques
                    </router-link>
                  </h3>
                  <p class="fr-card__desc">
                    Visualisez l'évolution de vos émotions sur une semaine,
                    un mois ou une année avec des graphiques clairs.
                  </p>
                  <p class="fr-card__detail fr-icon-bar-chart-box-line">
                    Analyse personnalisée
                  </p>
                </div>
              </div>
              <div class="fr-card__header">
                <div class="fr-card__img">
                  <svg
                    viewBox="0 0 200 120"
                    style="width:100%;background:#E3F2FD"
                  >
                    <text
                      x="50%"
                      y="50%"
                      text-anchor="middle"
                      dy=".3em"
                      font-size="40"
                    >📈🎯</text>
                  </svg>
                </div>
                <ul class="fr-badges-group">
                  <li>
                    <p class="fr-badge fr-badge--green-emeraude">
                      Connexion requise
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comment ça marche -->
    <section
      class="fr-py-8w"
      style="background:#f6f6f6"
    >
      <div class="fr-container">
        <h2 class="fr-mb-4w">
          Comment fonctionne le tracker ?
        </h2>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-4">
            <div class="stat-card">
              <div class="stat-card__number">
                1
              </div>
              <h3 class="fr-h5 fr-mt-2w">
                Choisissez une émotion
              </h3>
              <p class="fr-text--sm">
                Sélectionnez parmi 7 émotions de base (Joie, Colère, Peur...)
                puis précisez avec une sous-émotion.
              </p>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-4">
            <div class="stat-card">
              <div class="stat-card__number">
                2
              </div>
              <h3 class="fr-h5 fr-mt-2w">
                Indiquez l'intensité
              </h3>
              <p class="fr-text--sm">
                Évaluez l'intensité de votre ressenti sur une échelle de 1 à 10
                et ajoutez une note si vous le souhaitez.
              </p>
            </div>
          </div>
          <div class="fr-col-12 fr-col-md-4">
            <div class="stat-card">
              <div class="stat-card__number">
                3
              </div>
              <h3 class="fr-h5 fr-mt-2w">
                Suivez votre évolution
              </h3>
              <p class="fr-text--sm">
                Consultez vos rapports hebdomadaires et mensuels
                pour mieux comprendre vos patterns émotionnels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="fr-py-8w">
      <div class="fr-container">
        <div class="fr-callout fr-callout--green-emeraude">
          <h3 class="fr-callout__title">
            Prêt à prendre soin de votre santé mentale ?
          </h3>
          <p class="fr-callout__text">
            Rejoignez CESIZen gratuitement et commencez dès aujourd'hui à suivre vos émotions.
            Votre bien-être mental est aussi important que votre santé physique.
          </p>
          <DsfrButton
            v-if="!authStore.isAuthenticated"
            label="Créer mon compte gratuitement"
            @click="$router.push('/auth/inscription')"
          />
          <DsfrButton
            v-if="authStore.isAuthenticated"
            label="Accéder au tracker"
            @click="$router.push('/tracker')"
          />
        </div>

        <!-- Derniers articles -->
        <template v-if="articles.length > 0">
          <h2 class="fr-h4 fr-mt-6w fr-mb-2w">
            Derniers articles
          </h2>
          <div class="fr-grid-row fr-grid-row--gutters">
            <div
              v-for="article in articles"
              :key="article.id"
              class="fr-col-12 fr-col-md-4"
            >
              <div class="fr-card fr-enlarge-link emotion-card">
                <div class="fr-card__body">
                  <div class="fr-card__content">
                    <h3 class="fr-card__title">
                      <router-link :to="`/informations/${article.id}`">
                        {{ article.titre }}
                      </router-link>
                    </h3>
                    <p class="fr-card__desc">
                      {{ article.resume || "Lire l'article..." }}
                    </p>
                    <p class="fr-card__detail">
                      {{ article.categorie_nom || '' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'

const authStore = useAuthStore()
const articles = ref([])

onMounted(async () => {
  try {
    const data = await api.get('/information/pages?limit=3')
    articles.value = data.data.pages
  } catch {
    // ignore
  }
})
</script>
