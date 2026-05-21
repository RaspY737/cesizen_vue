// @ts-check
import { test, expect } from '@playwright/test'

const API_URL = 'http://localhost:8080'

/** Helper : se connecter via API et retourner le token */
async function getToken(request, email = 'admin@cesizen.fr', password = 'Admin123!') {
  const response = await request.post(`${API_URL}/api/auth/login`, {
    data: { email, mot_de_passe: password },
  })
  const body = await response.json()
  return body.data?.token
}

/** Helper : créer un utilisateur via API et retourner token + info */
async function createUser(request) {
  const uid = Date.now()
  const email = `sec-${uid}@test.fr`
  const password = 'Secure123!'
  const response = await request.post(`${API_URL}/api/auth/register`, {
    data: { prenom: 'Sec', nom: 'Test', email, mot_de_passe: password },
  })
  const body = await response.json()
  return { email, password, token: body.data?.token, user: body.data?.user }
}

// ============================================================
// 4.1 Injection XSS
// ============================================================

test.describe('Sécurité — Injection XSS', () => {
  // SEC-01
  test('SEC-01 — Injection XSS dans le champ prénom à l\'inscription', async ({ page }) => {
    const xssPayload = '<script>alert("XSS")</script>'
    const email = `xss-${Date.now()}@test.fr`
    await page.goto('/auth/inscription')
    await page.getByLabel(/prénom/i).fill(xssPayload)
    await page.getByLabel(/^nom/i).fill('Test')
    await page.getByLabel(/email/i).fill(email)
    await page.getByLabel(/^mot de passe/i).first().fill('Secure123!')
    await page.getByLabel(/confirmer/i).fill('Secure123!')

    // Écouter les dialog (alert) — ne devrait pas se déclencher
    let alertFired = false
    page.on('dialog', () => { alertFired = true })

    await page.getByRole('button', { name: /créer mon compte/i }).click()
    await page.waitForLoadState('networkidle')

    // Aller sur le profil pour voir le prénom
    await page.goto('/profil')
    await page.waitForLoadState('networkidle')
    expect(alertFired).toBe(false)

    // Vérifier que le script n'est pas exécuté dans le DOM
    const htmlContent = await page.content()
    expect(htmlContent).not.toContain('<script>alert')
  })

  // SEC-02
  test('SEC-02 — Injection XSS dans la note du tracker', async ({ page, request }) => {
    const { token } = await createUser(request)
    const xssPayload = '<img src=x onerror=alert("XSS")>'

    // Créer une entrée avec XSS via API
    const emotions = await (await request.get(`${API_URL}/api/emotions`)).json()
    const emotionId = emotions.data?.[0]?.id || 1
    const subEmotions = await (await request.get(`${API_URL}/api/emotions/${emotionId}/sub-emotions`)).json()
    const subEmotionId = subEmotions.data?.[0]?.id || 1

    await request.post(`${API_URL}/api/tracker/entries`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { sous_emotion_id: subEmotionId, intensite: 5, notes: xssPayload },
    })

    // Vérifier dans le navigateur
    await page.goto('/')
    await page.evaluate((t) => localStorage.setItem('cesizen_token', t), token)
    await page.goto('/tracker')

    let alertFired = false
    page.on('dialog', () => { alertFired = true })
    await page.waitForLoadState('networkidle')
    expect(alertFired).toBe(false)
  })

  // SEC-03
  test('SEC-03 — Injection XSS dans le titre d\'un article', async ({ page, request }) => {
    const adminToken = await getToken(request)
    const xssTitle = '<script>document.location="http://evil.com"</script>'

    await request.post(`${API_URL}/api/admin/contents`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: { titre: xssTitle, contenu: 'Contenu normal', est_publiee: true },
    })

    // Vérifier côt�� visiteur
    await page.goto('/informations')
    let navigationChanged = false
    page.on('framenavigated', (frame) => {
      if (frame.url().includes('evil.com')) navigationChanged = true
    })
    await page.waitForLoadState('networkidle')
    expect(navigationChanged).toBe(false)
    // Le titre doit être affiché en texte brut
    const html = await page.content()
    expect(html).not.toMatch(/<script>document\.location/)
  })

  // SEC-04
  test('SEC-04 — Injection XSS dans le contenu d\'un article', async ({ page, request }) => {
    const adminToken = await getToken(request)
    const xssContent = '<div onmouseover=alert("XSS")>Hover me</div><iframe src="http://evil.com"></iframe>'

    const resp = await request.post(`${API_URL}/api/admin/contents`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: { titre: `Article SEC-04 ${Date.now()}`, contenu: xssContent, est_publiee: true },
    })
    const article = await resp.json()
    const id = article.data?.id

    if (id) {
      await page.goto(`/informations/${id}`)
      let alertFired = false
      page.on('dialog', () => { alertFired = true })
      await page.waitForLoadState('networkidle')
      expect(alertFired).toBe(false)
      // Pas d'iframe
      const iframes = await page.locator('iframe[src*="evil"]').count()
      expect(iframes).toBe(0)
    }
  })

  // SEC-05
  test('SEC-05 — Injection XSS dans le champ de recherche admin', async ({ page }) => {
    await page.goto('/auth/connexion')
    await page.getByLabel(/email/i).fill('admin@cesizen.fr')
    await page.getByLabel(/mot de passe/i).fill('Admin123!')
    await page.getByRole('button', { name: /se connecter/i }).click()
    await page.waitForURL('/', { timeout: 10000 }).catch(() => {})

    await page.goto('/admin/utilisateurs')
    const searchInput = page.getByPlaceholder(/nom ou email/i).or(page.getByLabel(/rechercher/i))
    if (await searchInput.isVisible()) {
      let alertFired = false
      page.on('dialog', () => { alertFired = true })
      await searchInput.fill('"><script>alert(1)</script>')
      await page.waitForLoadState('networkidle')
      expect(alertFired).toBe(false)
    }
  })
})

// ============================================================
// 4.2 Injection SQL
// ============================================================

test.describe('Sécurité — Injection SQL', () => {
  // SEC-06
  test('SEC-06 — Injection SQL dans le champ email à la connexion', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/auth/login`, {
      data: { email: "' OR 1=1 --", mot_de_passe: 'nimportequoi' },
    })
    expect(response.status()).toBeGreaterThanOrEqual(400)
    const body = await response.json()
    // Pas d'erreur SQL exposée
    const bodyStr = JSON.stringify(body)
    expect(bodyStr).not.toMatch(/syntax error|pg_|SELECT|FROM|postgresql/i)
  })

  // SEC-07
  test('SEC-07 — Injection SQL dans le champ email à l\'inscription', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/auth/register`, {
      data: {
        prenom: 'Test',
        nom: 'Test',
        email: "test@test.fr'; DROP TABLE utilisateur; --",
        mot_de_passe: 'Secure123!',
      },
    })
    // L'app ne doit pas crasher
    expect(response.status()).toBeLessThan(500)
    const bodyStr = JSON.stringify(await response.json())
    expect(bodyStr).not.toMatch(/syntax error|pg_|DROP TABLE|postgresql/i)
  })

  // SEC-08
  test('SEC-08 — Injection SQL dans les filtres du tracker', async ({ request }) => {
    const { token } = await createUser(request)
    const response = await request.get(
      `${API_URL}/api/tracker/entries?period=week' UNION SELECT * FROM utilisateur --`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    // Ne doit pas retourner de données d'autres tables
    expect(response.status()).toBeLessThan(500)
    const bodyStr = JSON.stringify(await response.json())
    expect(bodyStr).not.toMatch(/mot_de_passe|password_hash|pg_|syntax error/i)
  })
})

// ============================================================
// 4.3 Contournement d'authentification et d'autorisation
// ============================================================

test.describe('Sécurité — Contournement d\'authentification', () => {
  // SEC-09
  test('SEC-09 — Accès /admin avec un token utilisateur standard', async ({ page, request }) => {
    const { token } = await createUser(request)
    await page.goto('/')
    await page.evaluate((t) => localStorage.setItem('cesizen_token', t), token)
    await page.goto('/admin')
    // L'API doit refuser les données
    const apiResponse = await request.get(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(apiResponse.status()).toBe(403)
  })

  // SEC-10
  test('SEC-10 — Fabrication d\'un faux token JWT', async ({ request }) => {
    const fakeToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW5pc3RyYXRldXIifQ.fake_signature'
    const response = await request.get(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${fakeToken}` },
    })
    expect(response.status()).toBe(401)
  })

  // SEC-11
  test('SEC-11 — Modification du token JWT pour usurper un rôle admin', async ({ request }) => {
    const { token } = await createUser(request)
    // Modifier le payload du token (changer le milieu)
    const parts = token.split('.')
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    payload.role = 'administrateur'
    const modifiedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const modifiedToken = `${parts[0]}.${modifiedPayload}.${parts[2]}`

    const response = await request.get(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${modifiedToken}` },
    })
    // Doit rejeter car la signature ne correspond plus
    expect(response.status()).toBeGreaterThanOrEqual(401)
  })

  // SEC-12
  test('SEC-12 — Endpoints API admin sans token', async ({ request }) => {
    const endpoints = [
      { method: 'GET', path: '/api/admin/users' },
      { method: 'GET', path: '/api/admin/stats' },
      { method: 'GET', path: '/api/admin/contents' },
      { method: 'GET', path: '/api/admin/emotions' },
    ]
    for (const ep of endpoints) {
      const response = await request.get(`${API_URL}${ep.path}`)
      expect(response.status()).toBe(401)
    }
  })

  // SEC-13
  test('SEC-13 — Endpoints API admin avec token utilisateur standard', async ({ request }) => {
    const { token } = await createUser(request)
    const endpoints = [
      '/api/admin/users',
      '/api/admin/stats',
      '/api/admin/contents',
      '/api/admin/emotions',
    ]
    for (const path of endpoints) {
      const response = await request.get(`${API_URL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(response.status()).toBe(403)
    }
  })
})

// ============================================================
// 4.4 IDOR (accès aux données d'autres utilisateurs)
// ============================================================

test.describe('Sécurité — IDOR', () => {
  // SEC-14
  test('SEC-14 — Lire l\'entrée tracker d\'un autre utilisateur', async ({ request }) => {
    // User A crée une entrée
    const userA = await createUser(request)
    const emotions = await (await request.get(`${API_URL}/api/emotions`)).json()
    const emotionId = emotions.data?.[0]?.id || 1
    const subEmotions = await (await request.get(`${API_URL}/api/emotions/${emotionId}/sub-emotions`)).json()
    const subEmotionId = subEmotions.data?.[0]?.id || 1

    const entryResp = await request.post(`${API_URL}/api/tracker/entries`, {
      headers: { Authorization: `Bearer ${userA.token}` },
      data: { sous_emotion_id: subEmotionId, intensite: 7, notes: 'Entrée de A' },
    })
    const entry = await entryResp.json()
    const entryId = entry.data?.id

    // User B tente de lire l'entrée de A
    const userB = await createUser(request)
    const response = await request.get(`${API_URL}/api/tracker/entries/${entryId}`, {
      headers: { Authorization: `Bearer ${userB.token}` },
    })
    expect(response.status()).toBe(404)
  })

  // SEC-15
  test('SEC-15 — Modifier l\'entrée tracker d\'un autre utilisateur', async ({ request }) => {
    const userA = await createUser(request)
    const emotions = await (await request.get(`${API_URL}/api/emotions`)).json()
    const subEmotions = await (await request.get(`${API_URL}/api/emotions/${emotions.data?.[0]?.id || 1}/sub-emotions`)).json()
    const subEmotionId = subEmotions.data?.[0]?.id || 1

    const entryResp = await request.post(`${API_URL}/api/tracker/entries`, {
      headers: { Authorization: `Bearer ${userA.token}` },
      data: { sous_emotion_id: subEmotionId, intensite: 7, notes: 'Original' },
    })
    const entryId = (await entryResp.json()).data?.id

    const userB = await createUser(request)
    const response = await request.put(`${API_URL}/api/tracker/entries/${entryId}`, {
      headers: { Authorization: `Bearer ${userB.token}` },
      data: { sous_emotion_id: subEmotionId, intensite: 1, notes: 'Piraté' },
    })
    expect(response.status()).toBe(404)

    // Vérifier que l'entrée de A est intacte
    const check = await request.get(`${API_URL}/api/tracker/entries/${entryId}`, {
      headers: { Authorization: `Bearer ${userA.token}` },
    })
    const checkBody = await check.json()
    expect(checkBody.data?.notes).toBe('Original')
  })

  // SEC-16
  test('SEC-16 — Supprimer l\'entrée tracker d\'un autre utilisateur', async ({ request }) => {
    const userA = await createUser(request)
    const emotions = await (await request.get(`${API_URL}/api/emotions`)).json()
    const subEmotions = await (await request.get(`${API_URL}/api/emotions/${emotions.data?.[0]?.id || 1}/sub-emotions`)).json()
    const subEmotionId = subEmotions.data?.[0]?.id || 1

    const entryResp = await request.post(`${API_URL}/api/tracker/entries`, {
      headers: { Authorization: `Bearer ${userA.token}` },
      data: { sous_emotion_id: subEmotionId, intensite: 5, notes: 'Ne pas supprimer' },
    })
    const entryId = (await entryResp.json()).data?.id

    const userB = await createUser(request)
    const response = await request.delete(`${API_URL}/api/tracker/entries/${entryId}`, {
      headers: { Authorization: `Bearer ${userB.token}` },
    })
    expect(response.status()).toBe(404)

    // L'entrée existe toujours pour A
    const check = await request.get(`${API_URL}/api/tracker/entries/${entryId}`, {
      headers: { Authorization: `Bearer ${userA.token}` },
    })
    expect(check.status()).toBe(200)
  })

  // SEC-17
  test('SEC-17 — Consulter le profil d\'un autre utilisateur', async ({ request }) => {
    const userA = await createUser(request)
    const userB = await createUser(request)

    // User B ne peut accéder qu'à son propre profil
    const response = await request.get(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${userB.token}` },
    })
    const body = await response.json()
    expect(body.data?.email).toBe(userB.email)
    expect(body.data?.email).not.toBe(userA.email)
  })
})

// ============================================================
// 4.5 Sécurité des mots de passe et tokens
// ============================================================

test.describe('Sécurité — Mots de passe et tokens', () => {
  // SEC-18
  test('SEC-18 — Le mot de passe n\'est jamais dans les réponses API', async ({ request }) => {
    const loginResp = await request.post(`${API_URL}/api/auth/login`, {
      data: { email: 'admin@cesizen.fr', mot_de_passe: 'Admin123!' },
    })
    const loginBody = JSON.stringify(await loginResp.json())
    expect(loginBody).not.toMatch(/password_hash|mot_de_passe.*\$argon|Admin123!/i)

    const token = (await loginResp.json()).data?.token || await getToken(request)
    const profileResp = await request.get(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const profileBody = JSON.stringify(await profileResp.json())
    expect(profileBody).not.toMatch(/password_hash|\$argon/)

    const usersResp = await request.get(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const usersBody = JSON.stringify(await usersResp.json())
    expect(usersBody).not.toMatch(/password_hash|\$argon/)
  })

  // SEC-19
  test('SEC-19 — Le token est stocké dans localStorage, pas dans les cookies', async ({ page }) => {
    await page.goto('/auth/connexion')
    await page.getByLabel(/email/i).fill('admin@cesizen.fr')
    await page.getByLabel(/mot de passe/i).fill('Admin123!')
    await page.getByRole('button', { name: /se connecter/i }).click()
    await page.waitForURL('/', { timeout: 10000 }).catch(() => {})

    const token = await page.evaluate(() => localStorage.getItem('cesizen_token'))
    expect(token).toBeTruthy()
    // Vérifier format JWT (3 parties séparées par des points)
    expect(token.split('.').length).toBe(3)

    // Pas de token dans les cookies
    const cookies = await page.context().cookies()
    const tokenCookie = cookies.find((c) => c.value === token)
    expect(tokenCookie).toBeUndefined()
  })

  // SEC-20
  test('SEC-20 — Token expiré rejeté par l\'API', async ({ request }) => {
    // Un token avec une signature invalide ou expirée
    const expiredToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW5pc3RyYXRldXIiLCJleHAiOjF9.invalid'
    const response = await request.get(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${expiredToken}` },
    })
    expect(response.status()).toBe(401)
  })
})

// ============================================================
// 4.6 Robustesse des entrées
// ============================================================

test.describe('Sécurité — Robustesse des entrées', () => {
  // SEC-21
  test('SEC-21 — Intensité hors limites via l\'API', async ({ request }) => {
    const { token } = await createUser(request)
    const emotions = await (await request.get(`${API_URL}/api/emotions`)).json()
    const subEmotions = await (await request.get(`${API_URL}/api/emotions/${emotions.data?.[0]?.id || 1}/sub-emotions`)).json()
    const subEmotionId = subEmotions.data?.[0]?.id || 1

    // Intensité > 10
    const resp1 = await request.post(`${API_URL}/api/tracker/entries`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { sous_emotion_id: subEmotionId, intensite: 999 },
    })
    expect(resp1.status()).toBe(400)

    // Intensité < 1
    const resp2 = await request.post(`${API_URL}/api/tracker/entries`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { sous_emotion_id: subEmotionId, intensite: -5 },
    })
    expect(resp2.status()).toBe(400)

    // Intensité = 0
    const resp3 = await request.post(`${API_URL}/api/tracker/entries`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { sous_emotion_id: subEmotionId, intensite: 0 },
    })
    expect(resp3.status()).toBe(400)
  })

  // SEC-22
  test('SEC-22 �� sous_emotion_id inexistant', async ({ request }) => {
    const { token } = await createUser(request)
    const response = await request.post(`${API_URL}/api/tracker/entries`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { sous_emotion_id: 99999, intensite: 5 },
    })
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  // SEC-23
  test('SEC-23 — Champs supplémentaires malveillants ignorés', async ({ request }) => {
    const { token, email } = await createUser(request)

    // Tenter d'élever les privilèges via le profil
    const response = await request.put(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { nom: 'Test', role: 'administrateur', is_admin: true },
    })

    // Vérifier que le rôle n'a pas changé
    const profile = await request.get(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const body = await profile.json()
    expect(body.data?.role).toBe('utilisateur')
  })

  // SEC-24
  test('SEC-24 — Les messages d\'erreur ne révèlent pas d\'infos sensibles', async ({ request }) => {
    // JSON malformé
    const resp1 = await request.post(`${API_URL}/api/auth/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: 'invalid json{{{',
    })
    const body1 = JSON.stringify(await resp1.json().catch(() => ({})))
    expect(body1).not.toMatch(/stack trace|panic|unwrap|at line|pg_catalog/i)

    // ID non numérique
    const resp2 = await request.get(`${API_URL}/api/information/pages/abc`)
    expect(resp2.status()).toBeGreaterThanOrEqual(400)
    const body2 = JSON.stringify(await resp2.json().catch(() => ({})))
    expect(body2).not.toMatch(/syntax error|pg_|SELECT|FROM|table/i)
  })
})
