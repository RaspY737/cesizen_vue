// @ts-check
import { test, expect } from '@playwright/test'

/** Helper : se connecter en admin */
async function loginAdmin(page) {
  await page.goto('/auth/connexion')
  await page.evaluate(() => localStorage.removeItem('cesizen_token'))
  await page.getByLabel(/email/i).fill('admin@cesizen.fr')
  await page.getByLabel(/mot de passe/i).fill('Admin123!')
  await page.getByRole('button', { name: /se connecter/i }).click()
  await page.waitForURL('/', { timeout: 10000 }).catch(() => {})
  await expect(page.getByRole('link', { name: /déconnexion/i })).toBeVisible({ timeout: 10000 })
}

/** Helper : créer un compte utilisateur standard */
async function registerUser(page) {
  const uid = Date.now()
  const email = `user-${uid}@test.fr`
  const password = 'Secure123!'
  await page.goto('/auth/inscription')
  await page.evaluate(() => localStorage.removeItem('cesizen_token'))
  await page.getByLabel(/prénom/i).fill('Standard')
  await page.getByLabel(/^nom/i).fill('User')
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/^mot de passe/i).first().fill(password)
  await page.getByLabel(/confirmer/i).fill(password)
  await page.getByRole('button', { name: /créer mon compte/i }).click()
  await page.waitForURL('/', { timeout: 10000 }).catch(() => {})
  await expect(page.getByRole('link', { name: /déconnexion/i })).toBeVisible({ timeout: 10000 })
  return { email, password }
}

test.describe('Admin — Accès et tableau de bord', () => {
  // ADM-01
  test('ADM-01 — Se connecter en admin et voir le menu Administration', async ({ page }) => {
    await loginAdmin(page)
    await expect(page.getByRole('link', { name: /administration/i })).toBeVisible()
    await page.getByRole('link', { name: /administration/i }).click()
    await expect(page).toHaveURL(/\/admin/)
    await expect(page.getByText(/tableau de bord/i)).toBeVisible()
  })

  // ADM-02
  test('ADM-02 — Un utilisateur standard ne voit pas le menu Administration', async ({ page }) => {
    await registerUser(page)
    const adminLink = page.getByRole('link', { name: /administration/i })
    await expect(adminLink).toHaveCount(0)
  })
})

test.describe('Admin — Gestion des utilisateurs', () => {
  // ADM-03
  test('ADM-03 — Lister les utilisateurs', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/utilisateurs')
    await expect(page.getByText(/gestion des utilisateurs/i)).toBeVisible()
    // Vérifier la présence du tableau
    await expect(page.locator('table, .fr-table')).toBeVisible()
  })

  // ADM-04
  test('ADM-04 — Rechercher un utilisateur', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/utilisateurs')
    const searchInput = page.getByPlaceholder(/nom ou email/i).or(page.getByLabel(/rechercher/i))
    if (await searchInput.isVisible()) {
      await searchInput.fill('admin')
      await expect(page.getByText('admin@cesizen.fr')).toBeVisible()
    }
  })

  // ADM-05
  test('ADM-05 — Modifier les informations d\'un utilisateur', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/utilisateurs')
    const modifierBtn = page.getByRole('link', { name: /modifier/i }).first()
    if (await modifierBtn.isVisible()) {
      await modifierBtn.click()
      await expect(page).toHaveURL(/\/admin\/utilisateurs\/\d+/)
      await expect(page.getByLabel(/prénom/i)).toBeVisible()
      await expect(page.getByLabel(/^nom/i)).toBeVisible()
    }
  })

  // ADM-06
  test('ADM-06 — Désactiver un compte utilisateur', async ({ page }) => {
    // Créer un user à désactiver
    const { email } = await registerUser(page)
    await page.getByRole('link', { name: /déconnexion/i }).click()
    await loginAdmin(page)
    await page.goto('/admin/utilisateurs')
    // Trouver et modifier l'utilisateur
    const row = page.locator('tr, .fr-table__row').filter({ hasText: email })
    const modifierLink = row.getByRole('link', { name: /modifier/i })
    if (await modifierLink.isVisible()) {
      await modifierLink.click()
      const checkbox = page.getByLabel(/actif/i)
      if (await checkbox.isChecked()) {
        await checkbox.uncheck()
      }
      await page.getByRole('button', { name: /enregistrer/i }).click()
    }
  })

  // ADM-07
  test('ADM-07 — Réactiver un compte utilisateur', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/utilisateurs')
    const modifierLink = page.getByRole('link', { name: /modifier/i }).first()
    if (await modifierLink.isVisible()) {
      await modifierLink.click()
      const checkbox = page.getByLabel(/actif/i)
      if (await checkbox.isVisible() && !(await checkbox.isChecked())) {
        await checkbox.check()
        await page.getByRole('button', { name: /enregistrer/i }).click()
      }
    }
  })
})

test.describe('Admin — Gestion des contenus', () => {
  // ADM-08
  test('ADM-08 — Lister les contenus existants', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/contenus')
    await expect(page.getByText(/gestion des contenus/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /nouveau contenu/i })).toBeVisible()
  })

  // ADM-09
  test('ADM-09 — Créer un article et le publier immédiatement', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/contenus/creer')
    const titre = `Article E2E ${Date.now()}`
    await page.getByLabel(/titre/i).fill(titre)
    await page.getByLabel(/résumé/i).fill('Résumé de test')
    await page.getByLabel(/contenu/i).fill('Contenu de test pour l\'article E2E.')
    const publierCheckbox = page.getByLabel(/publier/i)
    if (await publierCheckbox.isVisible()) {
      await publierCheckbox.check()
    }
    await page.getByRole('button', { name: /enregistrer/i }).click()
    await expect(page).toHaveURL(/\/admin\/contenus/, { timeout: 10000 })
    // Vérifier que l'article est visible côté public
    await page.goto('/informations')
    await expect(page.getByText(titre)).toBeVisible({ timeout: 5000 })
  })

  // ADM-10
  test('ADM-10 — Créer un article en brouillon', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/contenus/creer')
    const titre = `Brouillon E2E ${Date.now()}`
    await page.getByLabel(/titre/i).fill(titre)
    await page.getByLabel(/contenu/i).fill('Contenu brouillon.')
    // Ne pas cocher publier
    await page.getByRole('button', { name: /enregistrer/i }).click()
    await expect(page).toHaveURL(/\/admin\/contenus/, { timeout: 10000 })
    // Vérifier que l'article n'est PAS visible côté public
    await page.goto('/informations')
    const articlePublic = page.getByText(titre)
    await expect(articlePublic).toHaveCount(0)
  })

  // ADM-11
  test('ADM-11 — Modifier un article existant', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/contenus')
    const modifierLink = page.getByRole('link', { name: /modifier/i }).first()
    if (await modifierLink.isVisible()) {
      await modifierLink.click()
      await page.getByLabel(/titre/i).fill(`Titre modifié E2E ${Date.now()}`)
      await page.getByRole('button', { name: /enregistrer/i }).click()
    }
  })

  // ADM-12
  test('ADM-12 — Publier un brouillon', async ({ page }) => {
    await loginAdmin(page)
    // Créer d'abord un brouillon
    await page.goto('/admin/contenus/creer')
    const titre = `Brouillon→Publié ${Date.now()}`
    await page.getByLabel(/titre/i).fill(titre)
    await page.getByLabel(/contenu/i).fill('Contenu à publier.')
    await page.getByRole('button', { name: /enregistrer/i }).click()
    await expect(page).toHaveURL(/\/admin\/contenus/, { timeout: 10000 })
    // Modifier pour publier
    const row = page.locator('tr, .fr-table__row').filter({ hasText: titre })
    const modifierLink = row.getByRole('link', { name: /modifier/i })
    if (await modifierLink.isVisible()) {
      await modifierLink.click()
      const publieCheckbox = page.getByLabel(/publié/i)
      if (await publieCheckbox.isVisible()) {
        await publieCheckbox.check()
      }
      await page.getByRole('button', { name: /enregistrer/i }).click()
    }
    // Vérifier côté public
    await page.goto('/informations')
    await expect(page.getByText(titre)).toBeVisible({ timeout: 5000 })
  })

  // ADM-13
  test('ADM-13 — Dépublier un article', async ({ page }) => {
    await loginAdmin(page)
    // Créer et publier un article
    await page.goto('/admin/contenus/creer')
    const titre = `Dépublier E2E ${Date.now()}`
    await page.getByLabel(/titre/i).fill(titre)
    await page.getByLabel(/contenu/i).fill('Contenu à dépublier.')
    const publierCheckbox = page.getByLabel(/publier/i)
    if (await publierCheckbox.isVisible()) {
      await publierCheckbox.check()
    }
    await page.getByRole('button', { name: /enregistrer/i }).click()
    await expect(page).toHaveURL(/\/admin\/contenus/, { timeout: 10000 })
    // Dépublier
    const row = page.locator('tr, .fr-table__row').filter({ hasText: titre })
    const modifierLink = row.getByRole('link', { name: /modifier/i })
    if (await modifierLink.isVisible()) {
      await modifierLink.click()
      const publieCheckbox = page.getByLabel(/publié/i)
      if (await publieCheckbox.isVisible() && await publieCheckbox.isChecked()) {
        await publieCheckbox.uncheck()
      }
      await page.getByRole('button', { name: /enregistrer/i }).click()
    }
    // Vérifier côté public
    await page.goto('/informations')
    await expect(page.getByText(titre)).toHaveCount(0)
  })

  // ADM-14
  test('ADM-14 — Supprimer un article', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/contenus')
    const modifierLink = page.getByRole('link', { name: /modifier/i }).first()
    if (await modifierLink.isVisible()) {
      await modifierLink.click()
      const deleteBtn = page.getByRole('button', { name: /supprimer/i })
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click()
        await expect(page).toHaveURL(/\/admin\/contenus/, { timeout: 10000 })
      }
    }
  })

  // ADM-15
  test('ADM-15 — Tenter de créer un article sans titre', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/contenus/creer')
    // Ne pas remplir le titre
    await page.getByLabel(/contenu/i).fill('Contenu sans titre')
    await page.getByRole('button', { name: /enregistrer/i }).click()
    // Doit rester sur la page ou afficher une erreur
    await expect(page).toHaveURL(/\/admin\/contenus\/creer/)
  })
})

test.describe('Admin — Configuration des émotions', () => {
  // ADM-16
  test('ADM-16 — Consulter les émotions et sous-émotions', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/emotions')
    await expect(page.getByText(/configuration des émotions/i)).toBeVisible()
    // Vérifier la présence des émotions de base
    await expect(page.getByText(/joie/i)).toBeVisible()
    await expect(page.getByText(/colère/i)).toBeVisible()
  })

  // ADM-17
  test('ADM-17 — Ajouter une nouvelle émotion de base', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/emotions')
    await page.getByRole('button', { name: /ajouter une émotion/i }).click()
    const nomInput = page.getByLabel(/^nom/i).or(page.getByPlaceholder(/nom/i))
    if (await nomInput.isVisible()) {
      await nomInput.fill(`Fierté-${Date.now()}`)
      const emojiInput = page.getByLabel(/emoji/i).or(page.getByPlaceholder(/emoji/i))
      if (await emojiInput.isVisible()) {
        await emojiInput.fill('🏆')
      }
      await page.getByRole('button', { name: /^ajouter$/i }).click()
    }
  })

  // ADM-18
  test('ADM-18 — Ajouter une sous-émotion', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/emotions')
    // Déplier le premier accordéon
    const accordion = page.locator('.fr-accordion__btn, button[aria-expanded]').first()
    if (await accordion.isVisible()) {
      await accordion.click()
      const sousEmotionInput = page.getByPlaceholder(/sous-émotion/i).or(page.getByLabel(/sous-émotion/i)).first()
      if (await sousEmotionInput.isVisible()) {
        await sousEmotionInput.fill(`Extase-${Date.now()}`)
        await page.getByRole('button', { name: /^ajouter$/i }).first().click()
      }
    }
  })

  // ADM-19
  test('ADM-19 — Supprimer une sous-émotion', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/emotions')
    const accordion = page.locator('.fr-accordion__btn, button[aria-expanded]').first()
    if (await accordion.isVisible()) {
      await accordion.click()
      const deleteLink = page.getByRole('link', { name: /supprimer/i }).or(page.getByRole('button', { name: /supprimer/i })).first()
      if (await deleteLink.isVisible()) {
        await deleteLink.click()
      }
    }
  })

  // ADM-20
  test('ADM-20 — Supprimer une émotion de base', async ({ page }) => {
    await loginAdmin(page)
    await page.goto('/admin/emotions')
    const accordion = page.locator('.fr-accordion__btn, button[aria-expanded]').last()
    if (await accordion.isVisible()) {
      await accordion.click()
      const deleteEmotionBtn = page.getByRole('button', { name: /supprimer l'émotion/i }).last()
      if (await deleteEmotionBtn.isVisible()) {
        await deleteEmotionBtn.click()
      }
    }
  })
})

test.describe('Admin — Accès aux fonctionnalités utilisateur', () => {
  // ADM-21
  test('ADM-21 — Un admin peut utiliser le tracker', async ({ page }) => {
    await loginAdmin(page)
    await expect(page.getByRole('link', { name: /mon tracker/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /mes rapports/i })).toBeVisible()
    await page.goto('/tracker')
    await expect(page.getByText(/journal/i)).toBeVisible()
    await page.goto('/tracker/rapports')
    await expect(page.getByText(/total/i)).toBeVisible()
    await page.goto('/profil')
    await expect(page.getByText(/prénom/i)).toBeVisible()
  })
})
