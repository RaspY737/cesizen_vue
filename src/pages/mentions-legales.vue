<template>
  <div class="fr-container fr-py-6w">
    <DsfrBreadcrumb
      :links="[
        { text: 'Accueil', to: '/' },
        { text: 'Mentions légales' },
      ]"
    />

    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-lg-8">
        <h1 class="fr-h1">Mentions légales</h1>
        <p class="fr-text--sm fr-text--mention fr-mb-4w">
          Dernière mise à jour : avril 2026
        </p>

        <section class="fr-mb-6w">
          <h2 class="fr-h2">Éditeur du site</h2>
          <div class="fr-table fr-table--no-caption">
            <table>
              <tbody>
                <tr>
                  <th scope="row">Nom du projet</th>
                  <td>CESIZen</td>
                </tr>
                <tr>
                  <th scope="row">Commanditaire</th>
                  <td>Ministère de la Prévention et de la Santé</td>
                </tr>
                <tr>
                  <th scope="row">Maîtrise d'œuvre</th>
                  <td>Silkify</td>
                </tr>
                <tr>
                  <th scope="row">Contact éditeur</th>
                  <td>
                    <a
                      href="mailto:contact@silkify.fr"
                      class="fr-link"
                    >contact@silkify.fr</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="fr-mb-6w">
          <h2 class="fr-h2">Hébergement</h2>
          <div class="fr-table fr-table--no-caption">
            <table>
              <tbody>
                <tr>
                  <th scope="row">Hébergeur</th>
                  <td>Clever Cloud SAS</td>
                </tr>
                <tr>
                  <th scope="row">Adresse</th>
                  <td>3 rue de l'Allier, 44000 Nantes, France</td>
                </tr>
                <tr>
                  <th scope="row">Site web</th>
                  <td>
                    <a
                      href="https://www.clever-cloud.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="fr-link"
                    >www.clever-cloud.com</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="fr-mb-6w">
          <h2 class="fr-h2">Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus présents sur ce site (textes, images, logos,
            architecture) est la propriété du Ministère de la Prévention et de la Santé
            ou de ses partenaires et est protégé par les lois relatives à la propriété
            intellectuelle.
          </p>
          <div class="fr-highlight fr-mt-3w">
            <p>
              Toute reproduction, représentation, modification ou exploitation, totale ou
              partielle, des contenus de ce site, sans autorisation écrite préalable, est
              strictement interdite.
            </p>
          </div>
        </section>

        <section class="fr-mb-6w">
          <h2 class="fr-h2">Limitation de responsabilité</h2>
          <p>
            Les informations présentes sur CESIZen sont fournies à titre indicatif et
            peuvent être modifiées sans préavis. L'éditeur ne saurait être tenu responsable
            des dommages directs ou indirects résultant de l'accès ou de l'utilisation de
            ce site.
          </p>
          <div class="fr-callout fr-mt-3w">
            <p class="fr-callout__title">Information importante</p>
            <p class="fr-callout__text">
              Les contenus informationnels de CESIZen ne constituent pas un avis médical
              et ne remplacent en aucun cas une consultation auprès d'un professionnel de
              santé qualifié.
            </p>
          </div>
        </section>

        <section>
          <h2 class="fr-h2">Droit applicable et juridiction</h2>
          <p>
            Le présent site est soumis au droit français. En cas de litige relatif à son
            utilisation ou à son contenu, les parties s'engagent à rechercher une solution
            amiable avant tout recours judiciaire. À défaut, les juridictions françaises
            compétentes seront saisies.
          </p>
        </section>
      </div>

      <div class="fr-col-12 fr-col-lg-3 fr-col-offset-lg-1">
        <div class="fr-summary">
          <p class="fr-summary__title">Sur cette page</p>
          <ol class="fr-summary__list">
            <li><a class="fr-summary__link" href="#editeur">Éditeur du site</a></li>
            <li><a class="fr-summary__link" href="#hebergement">Hébergement</a></li>
            <li><a class="fr-summary__link" href="#propriete">Propriété intellectuelle</a></li>
            <li><a class="fr-summary__link" href="#responsabilite">Limitation de responsabilité</a></li>
            <li><a class="fr-summary__link" href="#droit">Droit applicable</a></li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
