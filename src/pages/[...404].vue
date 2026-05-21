<template>
  <div class="fr-container fr-py-8w">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-8 fr-col-lg-6 fr-text--center">
        <h1 class="fr-display--xl fr-mb-1w">
          404
        </h1>
        <p class="fr-h3 fr-mb-3w">
          Page non trouvée
        </p>
        <p class="fr-text--lg fr-mb-4w">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <DsfrButton
          label="Retour à l'accueil"
          icon="ri-home-line"
          @click="$router.push('/')"
        />
      </div>
    </div>
  </div>
</template>
