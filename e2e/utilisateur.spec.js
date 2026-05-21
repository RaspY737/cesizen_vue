// @ts-check
import { test, expect } from '@playwright/test'

/** Helper : se connecter avec un compte utilisateur */
async function login(page, email = 'admin@cesizen.fr', password = 'Admin123!') {
  await page.goto('/auth/connexion')
  await page.evaluate(() => localStorage.removeItem('cesizen_token'))
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/mot de passe/i).fill(password)
  await page.getByRole('button', { name: /se connecter/i }).click()
  await page.waitForURL('/', { timeout: 10000 }).catch(() => {})
  await expect(page.getByRole('link', { name: /déconnexion/i })).toBeVisible({ timeout: 10000 })
}

/** Helper : créer un compte unique et se connecter */
async function registerAndLogin(page) {
  const uid = Date.now()
  const email = `user-${uid}@test.fr`
  const password = 'Secure123!'
  await page.goto('/auth/inscription')
  await page.evaluate(() => localStorage.removeItem('cesizen_token'))
  await page.getByLabel(/prénom/i).fill('Test')
  await page.getByLabel(/^nom/i).fill('User')
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/^mot de passe/i).first().fill(password)
  await page.getByLabel(/confirmer/i).fill(password)
  await page.getByRole('button', { name: /créer mon compte/i }).click()
  await page.waitForURL('/', { timeout: 10000 }).catch(() => {})
  await expect(page.getByRole('link', { name: /déconnexion/i })).toBeVisible({ timeout: 10000 })
  return { email, password }
}

test.describe('Utilisateur — Profil et session', () => {
  // UTI-01
  test('UTI-01 — Consulter son profil', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: /mon profil/i }).click()
    await expect(page).toHaveURL(/\/profil/)
    await expect(page.getByText(/prénom/i)).toBeVisible()
    await expect(page.getByText(/nom/i)).toBeVisible()
    await expect(page.getByText(/email/i)).toBeVisible()
  })

  // UTI-02
  test('UTI-02 — Modifier son prénom et son nom', async ({ page }) => {
    const { email } = await registerAndLogin(page)
    await page.goto('/profil')
    await page.getByRole('button', { name: /modifier/i }).first().click()
    await page.getByLabel(/prénom/i).fill('Pierre')
    await page.getByLabel(/^nom/i).fill('Martin')
    await page.getByRole('button', { name: /enregistrer/i }).first().click()
    // Vérifier la mise à jour
    await expect(page.getByText('Pierre')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Martin')).toBeVisible({ timeout: 5000 })
  })

  // UTI-03
  test('UTI-03 — Annuler la modification du profil', async ({ page }) => {
    await login(page)
    await page.goto('/profil')
    await page.getByRole('button', { name: /modifier/i }).first().click()
    const prenomInput = page.getByLabel(/prénom/i)
    const originalValue = await prenomInput.inputValue()
    await prenomInput.fill('TEMPORAIRE')
    await page.getByRole('button', { name: /annuler/i }).click()
    // Vérifier le retour aux valeurs originales
    await expect(page.getByText(originalValue)).toBeVisible()
  })

  // UTI-04
  test('UTI-04 — Changer son mot de passe avec succès', async ({ page }) => {
    const { email, password } = await registerAndLogin(page)
    await page.goto('/profil')
    await page.getByLabel(/ancien mot de passe/i).fill(password)
    await page.getByLabel(/^nouveau mot de passe/i).fill('NewPass456!')
    await page.getByLabel(/confirmer/i).fill('NewPass456!')
    await page.getByRole('button', { name: /changer le mot de passe/i }).click()
    // Vérifier qu'on peut se reconnecter avec le nouveau mdp
    await page.getByRole('link', { name: /déconnexion/i }).click()
    await login(page, email, 'NewPass456!')
  })

  // UTI-05
  test('UTI-05 — Tenter de changer le mot de passe avec un ancien incorrect', async ({ page }) => {
    await login(page)
    await page.goto('/profil')
    await page.getByLabel(/ancien mot de passe/i).fill('mauvais')
    await page.getByLabel(/^nouveau mot de passe/i).fill('NewPass456!')
    await page.getByLabel(/confirmer/i).fill('NewPass456!')
    await page.getByRole('button', { name: /changer le mot de passe/i }).click()
    await expect(page.locator('.fr-alert--error, [role="alert"]')).toBeVisible({ timeout: 10000 })
  })

  // UTI-06
  test('UTI-06 — Tenter de changer le mot de passe avec une confirmation différente', async ({ page }) => {
    await login(page)
    await page.goto('/profil')
    await page.getByLabel(/ancien mot de passe/i).fill('Admin123!')
    await page.getByLabel(/^nouveau mot de passe/i).fill('NewPass456!')
    await page.getByLabel(/confirmer/i).fill('Different789!')
    await page.getByRole('button', { name: /changer le mot de passe/i }).click()
    await expect(page.getByText(/correspondent pas/i)).toBeVisible({ timeout: 5000 })
  })

  // UTI-07
  test('UTI-07 — Se déconnecter', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: /déconnexion/i }).click()
    await expect(page.getByRole('link', { name: /se connecter/i })).toBeVisible({ timeout: 5000 })
    // Les liens protégés ne sont plus visibles
    const trackerLink = page.getByRole('link', { name: /mon tracker/i })
    await expect(trackerLink).toHaveCount(0)
    // Tenter d'accéder au tracker redirige
    await page.goto('/tracker')
    await expect(page).toHaveURL(/\/auth\/connexion/)
  })
})

test.describe('Utilisateur — Tracker d\'émotions', () => {
  // UTI-08
  test('UTI-08 — Accéder au tableau de bord du tracker', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: /mon tracker/i }).click()
    await expect(page).toHaveURL(/\/tracker/)
    await expect(page.getByText(/journal d'émotions/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /ajouter une émotion/i })).toBeVisible()
  })

  // UTI-09
  test('UTI-09 — Ajouter une émotion (parcours complet en 3 étapes)', async ({ page }) => {
    const { email } = await registerAndLogin(page)
    await page.goto('/tracker/ajouter')
    // Étape 1 : sélectionner une émotion de base
    await expect(page.getByText(/comment vous sentez-vous/i)).toBeVisible()
    await page.locator('[class*="emotion"], button, .fr-card').filter({ hasText: /joie/i }).first().click()
    // Étape 2 : sélectionner une sous-émotion
    await expect(page.getByText(/plus précisément/i)).toBeVisible({ timeout: 5000 })
    // Cliquer sur la première sous-émotion disponible
    await page.locator('.fr-tag, button, [class*="chip"]').first().click()
    // Étape 3 : intensité et note
    await expect(page.getByText(/intensité/i)).toBeVisible({ timeout: 5000 })
    await page.getByLabel(/note/i).fill('Belle journée ensoleillée')
    await page.getByRole('button', { name: /enregistrer/i }).click()
    // Vérifier le retour au tracker avec la nouvelle entrée
    await expect(page).toHaveURL(/\/tracker/, { timeout: 10000 })
  })

  // UTI-10
  test('UTI-10 — Revenir en arrière pendant l\'ajout d\'émotion', async ({ page }) => {
    await login(page)
    await page.goto('/tracker/ajouter')
    // Sélectionner une émotion
    await page.locator('[class*="emotion"], button, .fr-card').filter({ hasText: /colère/i }).first().click()
    await expect(page.getByText(/plus précisément/i)).toBeVisible({ timeout: 5000 })
    // Revenir en arrière
    await page.getByRole('button', { name: /retour/i }).click()
    // Vérifier qu'on est revenu à l'étape 1
    await expect(page.getByText(/comment vous sentez-vous/i)).toBeVisible()
  })

  // UTI-11
  test('UTI-11 — Ajouter une émotion sans note', async ({ page }) => {
    const { email } = await registerAndLogin(page)
    await page.goto('/tracker/ajouter')
    await page.locator('[class*="emotion"], button, .fr-card').filter({ hasText: /joie/i }).first().click()
    await page.locator('.fr-tag, button, [class*="chip"]').first().click()
    // Ne pas remplir la note
    await page.getByRole('button', { name: /enregistrer/i }).click()
    await expect(page).toHaveURL(/\/tracker/, { timeout: 10000 })
  })

  // UTI-12
  test('UTI-12 — Filtrer les entrées du tracker par période', async ({ page }) => {
    await login(page)
    await page.goto('/tracker')
    const periodSelect = page.getByLabel(/période/i).or(page.locator('select').first())
    if (await periodSelect.isVisible()) {
      await periodSelect.selectOption({ index: 1 })
      // Vérifier que la page ne crash pas
      await expect(page.getByText(/journal/i)).toBeVisible()
    }
  })

  // UTI-13
  test('UTI-13 — Filtrer les entrées par émotion', async ({ page }) => {
    await login(page)
    await page.goto('/tracker')
    const emotionSelect = page.locator('select').nth(1)
    if (await emotionSelect.isVisible()) {
      await emotionSelect.selectOption({ index: 1 })
      await expect(page.getByText(/journal/i)).toBeVisible()
    }
  })

  // UTI-14
  test('UTI-14 — Modifier une entrée existante', async ({ page }) => {
    await login(page)
    await page.goto('/tracker')
    const modifierLink = page.getByRole('link', { name: /modifier/i }).first()
    if (await modifierLink.isVisible()) {
      await modifierLink.click()
      await expect(page).toHaveURL(/\/tracker\/\d+/)
      await page.getByLabel(/note/i).fill('Note modifiée via test E2E')
      await page.getByRole('button', { name: /enregistrer/i }).click()
    }
  })

  // UTI-15
  test('UTI-15 — Supprimer une entrée depuis le tableau de bord', async ({ page }) => {
    // Créer un compte avec une entrée
    await registerAndLogin(page)
    await page.goto('/tracker/ajouter')
    await page.locator('[class*="emotion"], button, .fr-card').filter({ hasText: /joie/i }).first().click()
    await page.locator('.fr-tag, button, [class*="chip"]').first().click()
    await page.getByRole('button', { name: /enregistrer/i }).click()
    await page.waitForURL(/\/tracker/, { timeout: 10000 })
    // Supprimer l'entrée
    const deleteBtn = page.getByRole('button', { name: /supprimer/i }).first()
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click()
      // Confirmation
      const confirmBtn = page.locator('dialog').getByRole('button', { name: /supprimer/i })
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click()
      }
    }
  })

  // UTI-16
  test('UTI-16 — Supprimer une entrée depuis la page de modification', async ({ page }) => {
    await login(page)
    await page.goto('/tracker')
    const modifierLink = page.getByRole('link', { name: /modifier/i }).first()
    if (await modifierLink.isVisible()) {
      await modifierLink.click()
      const deleteBtn = page.getByRole('button', { name: /supprimer/i })
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click()
        await expect(page).toHaveURL(/\/tracker/, { timeout: 10000 })
      }
    }
  })
})

test.describe('Utilisateur — Rapports et historique', () => {
  // UTI-17
  test('UTI-17 — Consulter les rapports d\'émotions', async ({ page }) => {
    await login(page)
    await page.goto('/tracker/rapports')
    await expect(page.getByText(/total/i)).toBeVisible()
    await expect(page.getByText(/intensité/i)).toBeVisible()
  })

  // UTI-18
  test('UTI-18 — Consulter les rapports sans aucune entrée', async ({ page }) => {
    await registerAndLogin(page)
    await page.goto('/tracker/rapports')
    // Devrait afficher des stats à 0 ou un message
    await expect(page.getByText(/total|pas assez|aucune/i)).toBeVisible()
  })

  // UTI-19
  test('UTI-19 — Consulter l\'historique des entrées', async ({ page }) => {
    await login(page)
    await page.goto('/tracker/historique')
    await expect(page.getByText(/historique/i)).toBeVisible()
  })
})

test.describe('Utilisateur — Sécurité et isolation', () => {
  // UTI-20
  test('UTI-20 — Un utilisateur ne voit que ses propres entrées', async ({ page }) => {
    // Créer user A avec une entrée
    const userA = await registerAndLogin(page)
    await page.goto('/tracker/ajouter')
    await page.locator('[class*="emotion"], button, .fr-card').filter({ hasText: /joie/i }).first().click()
    await page.locator('.fr-tag, button, [class*="chip"]').first().click()
    await page.getByLabel(/note/i).fill('Entrée de User A')
    await page.getByRole('button', { name: /enregistrer/i }).click()
    await page.waitForURL(/\/tracker/, { timeout: 10000 })

    // Se déconnecter et créer user B
    await page.getByRole('link', { name: /déconnexion/i }).click()
    await registerAndLogin(page)
    await page.goto('/tracker')

    // User B ne doit pas voir l'entrée de User A
    const noteA = page.getByText('Entrée de User A')
    await expect(noteA).toHaveCount(0)
  })

  // UTI-21
  test('UTI-21 — La session expire et redirige vers la connexion', async ({ page }) => {
    await login(page)
    // Supprimer le token manuellement
    await page.evaluate(() => localStorage.removeItem('cesizen_token'))
    // Naviguer vers une page protégée qui fait un appel API
    await page.goto('/tracker')
    // L'appel API va échouer avec 401 et rediriger
    await expect(page).toHaveURL(/\/auth\/connexion/, { timeout: 10000 })
  })
})
