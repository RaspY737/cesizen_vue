// @ts-check
import { test, expect } from '@playwright/test'

test.describe('Visiteur non connecté — Navigation et accès public', () => {
  test.beforeEach(async ({ page }) => {
    // S'assurer qu'on est déconnecté
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('cesizen_token'))
  })

  // VIS-01
  test('VIS-01 — Accéder à la page d\'accueil', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('santé mentale')
    await expect(page.getByRole('link', { name: /commencer gratuitement/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /en savoir plus/i })).toBeVisible()
  })

  // VIS-02
  test('VIS-02 — Consulter la liste des articles d\'information', async ({ page }) => {
    await page.goto('/informations')
    await expect(page.locator('h1')).toContainText('Informations')
  })

  // VIS-03
  test('VIS-03 — Filtrer les articles par catégorie', async ({ page }) => {
    await page.goto('/informations')
    const tags = page.locator('.fr-tag, .fr-badge').first()
    if (await tags.isVisible()) {
      await tags.click()
      // Vérifier que la page ne crash pas après un clic sur un filtre
      await expect(page.locator('h1')).toContainText('Informations')
    }
  })

  // VIS-04
  test('VIS-04 — Lire le détail d\'un article', async ({ page }) => {
    await page.goto('/informations')
    const articleLink = page.locator('a[href*="/informations/"]').first()
    if (await articleLink.isVisible()) {
      await articleLink.click()
      await expect(page.locator('h1')).toBeVisible()
      // Vérifier le lien retour
      const retourLink = page.getByRole('link', { name: /retour/i })
      if (await retourLink.isVisible()) {
        await retourLink.click()
        await expect(page).toHaveURL(/\/informations/)
      }
    }
  })

  // VIS-05
  test('VIS-05 — Tenter d\'accéder au tracker sans être connecté', async ({ page }) => {
    await page.goto('/tracker')
    await expect(page).toHaveURL(/\/auth\/connexion/)
  })

  // VIS-06
  test('VIS-06 — Tenter d\'accéder à l\'administration sans être connecté', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/auth\/connexion/)
  })

  // VIS-07
  test('VIS-07 — Le menu ne montre pas les liens protégés', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /accueil/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /informations/i })).toBeVisible()
    // Les liens protégés ne doivent pas être visibles
    const trackerLink = page.getByRole('link', { name: /mon tracker/i })
    await expect(trackerLink).toHaveCount(0)
    const adminLink = page.getByRole('link', { name: /administration/i })
    await expect(adminLink).toHaveCount(0)
  })
})

test.describe('Visiteur non connecté — Inscription', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('cesizen_token'))
  })

  // VIS-08
  test('VIS-08 — Créer un compte avec des données valides', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@test.fr`
    await page.goto('/auth/inscription')
    await page.getByLabel(/prénom/i).fill('Jean')
    await page.getByLabel(/^nom/i).fill('Dupont')
    await page.getByLabel(/email/i).fill(uniqueEmail)
    await page.getByLabel(/^mot de passe/i).first().fill('Secure123!')
    await page.getByLabel(/confirmer/i).fill('Secure123!')
    await page.getByRole('button', { name: /créer mon compte/i }).click()
    // Après inscription réussie, on doit être redirigé
    await page.waitForURL('/', { timeout: 10000 }).catch(() => {})
    // Vérifier que les liens authentifiés apparaissent
    await expect(page.getByRole('link', { name: /déconnexion/i })).toBeVisible({ timeout: 10000 })
  })

  // VIS-09
  test('VIS-09 — Tenter de créer un compte avec un email déjà utilisé', async ({ page }) => {
    await page.goto('/auth/inscription')
    await page.getByLabel(/prénom/i).fill('Test')
    await page.getByLabel(/^nom/i).fill('Test')
    await page.getByLabel(/email/i).fill('admin@cesizen.fr')
    await page.getByLabel(/^mot de passe/i).first().fill('Test1234!')
    await page.getByLabel(/confirmer/i).fill('Test1234!')
    await page.getByRole('button', { name: /créer mon compte/i }).click()
    // Doit rester sur la page avec un message d'erreur
    await expect(page.locator('.fr-alert--error, [role="alert"]')).toBeVisible({ timeout: 10000 })
    await expect(page).toHaveURL(/\/auth\/inscription/)
  })

  // VIS-10
  test('VIS-10 — Tenter de créer un compte avec des mots de passe différents', async ({ page }) => {
    await page.goto('/auth/inscription')
    await page.getByLabel(/prénom/i).fill('Test')
    await page.getByLabel(/^nom/i).fill('Test')
    await page.getByLabel(/email/i).fill('vis10@test.fr')
    await page.getByLabel(/^mot de passe/i).first().fill('Secure123!')
    await page.getByLabel(/confirmer/i).fill('Different456!')
    await page.getByRole('button', { name: /créer mon compte/i }).click()
    // Doit afficher un message d'erreur de correspondance
    await expect(page.getByText(/correspondent pas/i)).toBeVisible({ timeout: 5000 })
  })

  // VIS-11
  test('VIS-11 — Tenter de créer un compte avec un mot de passe trop court', async ({ page }) => {
    await page.goto('/auth/inscription')
    await page.getByLabel(/prénom/i).fill('Test')
    await page.getByLabel(/^nom/i).fill('Test')
    await page.getByLabel(/email/i).fill('vis11@test.fr')
    await page.getByLabel(/^mot de passe/i).first().fill('Ab1!')
    await page.getByLabel(/confirmer/i).fill('Ab1!')
    await page.getByRole('button', { name: /créer mon compte/i }).click()
    // Doit rester sur la page (validation empêche la soumission)
    await expect(page).toHaveURL(/\/auth\/inscription/)
  })

  // VIS-12
  test('VIS-12 — Tenter de créer un compte avec des champs vides', async ({ page }) => {
    await page.goto('/auth/inscription')
    // Laisser prénom et nom vides
    await page.getByLabel(/email/i).fill('vis12@test.fr')
    await page.getByLabel(/^mot de passe/i).first().fill('Secure123!')
    await page.getByLabel(/confirmer/i).fill('Secure123!')
    await page.getByRole('button', { name: /créer mon compte/i }).click()
    // Doit rester sur la page ou afficher une erreur
    await expect(page).toHaveURL(/\/auth\/inscription/)
  })

  // VIS-13
  test('VIS-13 — Naviguer vers la page de connexion depuis l\'inscription', async ({ page }) => {
    await page.goto('/auth/inscription')
    await page.getByRole('link', { name: /déjà un compte/i }).click()
    await expect(page).toHaveURL(/\/auth\/connexion/)
  })
})

test.describe('Visiteur non connecté — Connexion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('cesizen_token'))
  })

  // VIS-14
  test('VIS-14 — Se connecter avec des identifiants valides', async ({ page }) => {
    await page.goto('/auth/connexion')
    await page.getByLabel(/email/i).fill('admin@cesizen.fr')
    await page.getByLabel(/mot de passe/i).fill('Admin123!')
    await page.getByRole('button', { name: /se connecter/i }).click()
    await page.waitForURL('/', { timeout: 10000 }).catch(() => {})
    await expect(page.getByRole('link', { name: /déconnexion/i })).toBeVisible({ timeout: 10000 })
  })

  // VIS-15
  test('VIS-15 — Se connecter avec un mauvais mot de passe', async ({ page }) => {
    await page.goto('/auth/connexion')
    await page.getByLabel(/email/i).fill('admin@cesizen.fr')
    await page.getByLabel(/mot de passe/i).fill('mauvais')
    await page.getByRole('button', { name: /se connecter/i }).click()
    await expect(page.locator('.fr-alert--error, [role="alert"]')).toBeVisible({ timeout: 10000 })
    await expect(page).toHaveURL(/\/auth\/connexion/)
  })

  // VIS-16
  test('VIS-16 — Se connecter avec un email inexistant', async ({ page }) => {
    await page.goto('/auth/connexion')
    await page.getByLabel(/email/i).fill('inexistant@test.fr')
    await page.getByLabel(/mot de passe/i).fill('Test1234!')
    await page.getByRole('button', { name: /se connecter/i }).click()
    await expect(page.locator('.fr-alert--error, [role="alert"]')).toBeVisible({ timeout: 10000 })
  })

  // VIS-17
  test('VIS-17 — Naviguer vers la page d\'inscription depuis la connexion', async ({ page }) => {
    await page.goto('/auth/connexion')
    await page.getByRole('link', { name: /pas encore de compte/i }).click()
    await expect(page).toHaveURL(/\/auth\/inscription/)
  })
})
