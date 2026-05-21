<template>
  <div class="fr-container fr-py-6w">
    <DsfrBreadcrumb
      :links="[
        { text: 'Accueil', to: '/' },
        { text: 'Données personnelles' },
      ]"
    />

    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-lg-8">
        <h1 class="fr-h1">Données personnelles</h1>
        <p class="fr-text--sm fr-text--mention fr-mb-4w">
          Dernière mise à jour : avril 2026
        </p>

        <div class="fr-callout fr-callout--blue-ecume fr-mb-6w">
          <p class="fr-callout__title">Protection de vos données</p>
          <p class="fr-callout__text">
            CESIZen s'engage à protéger vos données personnelles conformément au
            Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679)
            et à la loi Informatique et Libertés n°78-17 du 6 janvier 1978 modifiée.
          </p>
        </div>

        <section class="fr-mb-6w">
          <h2 class="fr-h2">Responsable du traitement</h2>
          <p>
            Le responsable du traitement est le
            <strong>Ministère de la Prévention et de la Santé</strong>, représenté dans
            le cadre de ce projet par <strong>Silkify</strong>.
          </p>
          <p class="fr-mt-2w">
            Pour toute question relative à vos données personnelles :
            <a
              href="mailto:rgpd@silkify.fr"
              class="fr-link"
            >rgpd@silkify.fr</a>
          </p>
        </section>

        <section class="fr-mb-6w">
          <h2 class="fr-h2">Données collectées</h2>
          <p>
            CESIZen collecte uniquement les données strictement nécessaires à la
            fourniture du service.
          </p>

          <h3 class="fr-h3 fr-mt-4w">Données de compte</h3>
          <div class="fr-table">
            <table>
              <caption>Données collectées lors de la création et de la gestion du compte</caption>
              <thead>
                <tr>
                  <th scope="col">Donnée</th>
                  <th scope="col">Finalité</th>
                  <th scope="col">Obligatoire</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Prénom et nom</td>
                  <td>Identification et personnalisation de l'interface</td>
                  <td>Oui</td>
                </tr>
                <tr>
                  <td>Adresse email</td>
                  <td>Authentification et communication</td>
                  <td>Oui</td>
                </tr>
                <tr>
                  <td>Mot de passe</td>
                  <td>Sécurisation de l'accès au compte (stocké chiffré)</td>
                  <td>Oui</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="fr-h3 fr-mt-4w">Données de suivi émotionnel</h3>
          <div class="fr-table">
            <table>
              <caption>Données collectées lors de l'utilisation du tracker d'émotions</caption>
              <thead>
                <tr>
                  <th scope="col">Donnée</th>
                  <th scope="col">Finalité</th>
                  <th scope="col">Obligatoire</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Émotion et sous-émotion</td>
                  <td>Enregistrement de l'état émotionnel</td>
                  <td>Oui</td>
                </tr>
                <tr>
                  <td>Niveau d'intensité (1 à 10)</td>
                  <td>Qualification de l'émotion ressentie</td>
                  <td>Oui</td>
                </tr>
                <tr>
                  <td>Note personnelle</td>
                  <td>Contextualisation libre de l'entrée</td>
                  <td>Non</td>
                </tr>
                <tr>
                  <td>Date et heure</td>
                  <td>Horodatage pour les rapports et statistiques</td>
                  <td>Automatique</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="fr-highlight fr-mt-4w">
            <p>
              <strong>Aucune donnée n'est transmise à des tiers.</strong> CESIZen
              n'intègre aucun outil d'analyse ou de publicité externe. Vos données de
              santé mentale restent strictement confidentielles.
            </p>
          </div>
        </section>

        <section class="fr-mb-6w">
          <h2 class="fr-h2">Base légale et finalités</h2>
          <p>
            Le traitement de vos données repose sur votre
            <strong>consentement explicite</strong> lors de la création de votre compte
            (article 6.1.a du RGPD), ainsi que sur l'exécution du contrat de service
            (article 6.1.b du RGPD).
          </p>
          <p class="fr-mt-2w">Vos données sont utilisées exclusivement pour :</p>
          <ul>
            <li>Gérer votre compte et vous authentifier de manière sécurisée</li>
            <li>Vous permettre de suivre et d'analyser votre état émotionnel</li>
            <li>Générer des rapports personnels accessibles uniquement par vous</li>
          </ul>
        </section>

        <section class="fr-mb-6w">
          <h2 class="fr-h2">Durée de conservation</h2>
          <p>
            Vos données sont conservées pendant toute la durée d'activité de votre compte.
            En cas de suppression de votre compte, l'ensemble de vos données personnelles
            et de vos entrées de suivi sont définitivement supprimées
            <strong>dans un délai de 30 jours</strong>.
          </p>
        </section>

        <section class="fr-mb-6w">
          <h2 class="fr-h2">Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants sur vos données :
          </p>

          <DsfrAccordionsGroup>
            <DsfrAccordion
              id="droit-acces"
              title="Droit d'accès"
            >
              <p>
                Vous pouvez à tout moment demander à consulter l'ensemble des données
                personnelles vous concernant qui sont traitées par CESIZen.
              </p>
            </DsfrAccordion>
            <DsfrAccordion
              id="droit-rectification"
              title="Droit de rectification"
            >
              <p>
                Vous pouvez modifier vos données (prénom, nom) directement depuis votre
                espace profil. Pour toute correction non disponible en self-service,
                contactez-nous.
              </p>
            </DsfrAccordion>
            <DsfrAccordion
              id="droit-effacement"
              title="Droit à l'effacement"
            >
              <p>
                Vous pouvez demander la suppression de votre compte et de l'ensemble de
                vos données à l'adresse
                <a
                  href="mailto:rgpd@silkify.fr"
                  class="fr-link"
                >rgpd@silkify.fr</a>.
                La suppression sera effective dans un délai de 30 jours.
              </p>
            </DsfrAccordion>
            <DsfrAccordion
              id="droit-portabilite"
              title="Droit à la portabilité"
            >
              <p>
                Vous pouvez demander à recevoir vos données dans un format structuré,
                couramment utilisé et lisible par machine.
              </p>
            </DsfrAccordion>
            <DsfrAccordion
              id="droit-opposition"
              title="Droit d'opposition et de limitation"
            >
              <p>
                Vous pouvez vous opposer au traitement de vos données ou en demander
                la limitation dans les cas prévus par le RGPD.
              </p>
            </DsfrAccordion>
          </DsfrAccordionsGroup>

          <p class="fr-mt-4w">
            Pour exercer ces droits, contactez :
            <a
              href="mailto:rgpd@silkify.fr"
              class="fr-link"
            >rgpd@silkify.fr</a>.
            En cas de réclamation non résolue, vous pouvez saisir la
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              class="fr-link"
            >Commission Nationale de l'Informatique et des Libertés (CNIL)</a>.
          </p>
        </section>

        <section>
          <h2 class="fr-h2">Sécurité</h2>
          <p>
            Des mesures techniques et organisationnelles appropriées sont mises en œuvre
            pour garantir la sécurité de vos données :
          </p>
          <ul>
            <li>Chiffrement des communications (HTTPS/TLS)</li>
            <li>Hachage des mots de passe (stockage en clair impossible)</li>
            <li>Authentification par jeton JWT à durée limitée</li>
            <li>Hébergement sur infrastructure européenne (Clever Cloud)</li>
          </ul>
        </section>
      </div>

      <div class="fr-col-12 fr-col-lg-3 fr-col-offset-lg-1">
        <nav
          class="fr-summary"
          aria-label="Sommaire"
        >
          <p class="fr-summary__title">Sur cette page</p>
          <ol class="fr-summary__list">
            <li><a class="fr-summary__link" href="#responsable">Responsable du traitement</a></li>
            <li><a class="fr-summary__link" href="#donnees">Données collectées</a></li>
            <li><a class="fr-summary__link" href="#base-legale">Base légale</a></li>
            <li><a class="fr-summary__link" href="#conservation">Durée de conservation</a></li>
            <li><a class="fr-summary__link" href="#droits">Vos droits</a></li>
            <li><a class="fr-summary__link" href="#securite">Sécurité</a></li>
          </ol>
        </nav>
      </div>
    </div>
  </div>
</template>
