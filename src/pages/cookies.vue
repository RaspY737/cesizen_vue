<template>
  <div class="fr-container fr-py-6w">
    <DsfrBreadcrumb
      :links="[
        { text: 'Accueil', to: '/' },
        { text: 'Gestion des cookies' },
      ]"
    />

    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-lg-8">
        <h1 class="fr-h1">Gestion des cookies</h1>
        <p class="fr-text--sm fr-text--mention fr-mb-4w">
          Dernière mise à jour : avril 2026
        </p>

        <div class="fr-notice fr-notice--info fr-mb-6w">
          <div class="fr-container">
            <div class="fr-notice__body">
              <p class="fr-notice__title">
                CESIZen n'utilise aucun cookie tiers ni outil de traçage publicitaire
                ou analytique.
              </p>
            </div>
          </div>
        </div>

        <section class="fr-mb-6w">
          <h2 class="fr-h2">Qu'est-ce qu'un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur,
            tablette, smartphone) lors de la consultation d'un site web. Il permet de
            conserver des informations entre deux visites.
          </p>
          <p class="fr-mt-2w">
            CESIZen n'utilise pas de cookies au sens strict. Pour assurer votre
            connexion, l'application recourt au <strong>stockage local du navigateur
            (localStorage)</strong>, qui fonctionne de la même façon mais reste
            strictement limité à votre appareil et n'est jamais transmis automatiquement
            au serveur.
          </p>
        </section>

        <section class="fr-mb-6w">
          <h2 class="fr-h2">Stockage utilisé par CESIZen</h2>

          <div class="fr-table">
            <table>
              <caption>Données de navigation stockées localement</caption>
              <thead>
                <tr>
                  <th scope="col">Nom</th>
                  <th scope="col">Type</th>
                  <th scope="col">Finalité</th>
                  <th scope="col">Durée</th>
                  <th scope="col">Obligatoire</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>cesizen_token</code></td>
                  <td>localStorage</td>
                  <td>Jeton d'authentification JWT — maintien de la session utilisateur</td>
                  <td>Jusqu'à la déconnexion</td>
                  <td>Oui</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="fr-highlight fr-mt-4w">
            <p>
              Ce stockage est <strong>strictement nécessaire</strong> au fonctionnement du
              service d'authentification. Il ne peut pas être désactivé sans rendre
              impossible la connexion à votre compte.
            </p>
          </div>
        </section>

        <section class="fr-mb-6w">
          <h2 class="fr-h2">Absence de traceurs tiers</h2>
          <p>CESIZen ne fait appel à aucun service tiers de traçage, notamment :</p>
          <ul>
            <li>Aucun outil de mesure d'audience (Google Analytics, Matomo, etc.)</li>
            <li>Aucun réseau publicitaire</li>
            <li>Aucun bouton de partage de réseaux sociaux</li>
            <li>Aucun service de vidéo embarqué (YouTube, Vimeo, etc.)</li>
          </ul>
        </section>

        <section>
          <h2 class="fr-h2">Supprimer les données stockées</h2>
          <p>
            Vous pouvez supprimer à tout moment le jeton de session en vous
            <strong>déconnectant</strong> depuis le menu de votre compte. Le token est
            alors immédiatement effacé de votre navigateur.
          </p>
          <p class="fr-mt-2w">
            Vous pouvez également vider manuellement le stockage local depuis les
            paramètres de confidentialité de votre navigateur ou ses outils de
            développement.
          </p>
          <p class="fr-mt-3w">
            Pour en savoir plus sur la gestion du stockage local, consultez la
            <a
              href="https://www.cnil.fr/fr/cookies-et-autres-traceurs"
              target="_blank"
              rel="noopener noreferrer"
              class="fr-link"
            >page dédiée de la CNIL sur les cookies et traceurs</a>.
          </p>
        </section>
      </div>

      <div class="fr-col-12 fr-col-lg-3 fr-col-offset-lg-1">
        <nav
          class="fr-summary"
          aria-label="Sommaire"
        >
          <p class="fr-summary__title">Sur cette page</p>
          <ol class="fr-summary__list">
            <li><a class="fr-summary__link" href="#definition">Qu'est-ce qu'un cookie ?</a></li>
            <li><a class="fr-summary__link" href="#stockage">Stockage utilisé</a></li>
            <li><a class="fr-summary__link" href="#tiers">Absence de traceurs tiers</a></li>
            <li><a class="fr-summary__link" href="#suppression">Supprimer les données</a></li>
          </ol>
        </nav>
      </div>
    </div>
  </div>
</template>
