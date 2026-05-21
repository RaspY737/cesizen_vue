/**
 * Tests unitaires - Service API (fonction request)
 * Testent les appels HTTP via api.get/post/put/patch/delete avec mock de fetch
 */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

// On doit réimporter le module après chaque mock de fetch
let api

function mockFetch(status, body, ok = null) {
  const isOk = ok !== null ? ok : status >= 200 && status < 300
  return vi.fn().mockResolvedValueOnce({
    status,
    ok: isOk,
    json: () => Promise.resolve(body),
  })
}

describe('api service - request()', () => {
  let originalLocation

  beforeEach(async () => {
    localStorage.clear()
    vi.resetModules()
    originalLocation = window.location
    // Mock window.location pour tester la redirection 401
    delete window.location
    window.location = { href: '' }
    // Réimporter le module frais pour chaque test
    const mod = await import('../api')
    api = mod.api
  })

  afterEach(() => {
    window.location = originalLocation
    vi.restoreAllMocks()
  })

  describe('méthodes HTTP', () => {
    it('api.get() appelle fetch avec la méthode GET et la bonne URL', async () => {
      const fetchMock = mockFetch(200, { data: [] })
      vi.stubGlobal('fetch', fetchMock)

      await api.get('/emotions')

      expect(fetchMock).toHaveBeenCalledWith('/api/emotions', expect.objectContaining({
        method: 'GET',
      }))
    })

    it('api.post() appelle fetch avec POST et le body JSON', async () => {
      const fetchMock = mockFetch(201, { data: { id: 1 } })
      vi.stubGlobal('fetch', fetchMock)

      await api.post('/auth/login', { email: 'test@test.fr', mot_de_passe: 'pass' })

      expect(fetchMock).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.fr', mot_de_passe: 'pass' }),
      }))
    })

    it('api.put() appelle fetch avec la méthode PUT', async () => {
      const fetchMock = mockFetch(200, { data: {} })
      vi.stubGlobal('fetch', fetchMock)

      await api.put('/users/me', { nom: 'Dupont' })

      expect(fetchMock).toHaveBeenCalledWith('/api/users/me', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ nom: 'Dupont' }),
      }))
    })

    it('api.patch() appelle fetch avec la méthode PATCH', async () => {
      const fetchMock = mockFetch(200, { data: {} })
      vi.stubGlobal('fetch', fetchMock)

      await api.patch('/admin/users/1/status', { actif: false })

      expect(fetchMock).toHaveBeenCalledWith('/api/admin/users/1/status', expect.objectContaining({
        method: 'PATCH',
      }))
    })

    it('api.delete() appelle fetch avec la méthode DELETE', async () => {
      const fetchMock = mockFetch(200, { message: 'Supprimé' })
      vi.stubGlobal('fetch', fetchMock)

      await api.delete('/tracker/entries/5')

      expect(fetchMock).toHaveBeenCalledWith('/api/tracker/entries/5', expect.objectContaining({
        method: 'DELETE',
      }))
    })

    it('api.get() n\'inclut pas de body dans les options fetch', async () => {
      const fetchMock = mockFetch(200, { data: [] })
      vi.stubGlobal('fetch', fetchMock)

      await api.get('/emotions')

      const callOptions = fetchMock.mock.calls[0][1]
      expect(callOptions.body).toBeUndefined()
    })
  })

  describe('parsing des réponses', () => {
    it('retourne le JSON parsé en cas de succès', async () => {
      const responseBody = { data: { id: 1, nom: 'Test' } }
      vi.stubGlobal('fetch', mockFetch(200, responseBody))

      const result = await api.get('/users/me')

      expect(result).toEqual(responseBody)
    })

    it('lance une erreur avec le message du serveur si réponse non-ok', async () => {
      vi.stubGlobal('fetch', mockFetch(400, {
        error: { message: 'Tous les champs obligatoires doivent être remplis' },
      }))

      await expect(api.post('/auth/register', {})).rejects.toThrow(
        'Tous les champs obligatoires doivent être remplis',
      )
    })

    it('lance "Erreur inconnue" si le body n\'a pas de message d\'erreur', async () => {
      vi.stubGlobal('fetch', mockFetch(500, {}))

      await expect(api.get('/test')).rejects.toThrow('Erreur inconnue')
    })
  })

  describe('gestion du 401', () => {
    it('supprime le token du localStorage sur 401', async () => {
      localStorage.setItem('cesizen_token', 'old-token')
      vi.stubGlobal('fetch', mockFetch(401, {}))

      try {
        await api.get('/users/me')
      } catch {
        // attendu
      }

      expect(localStorage.getItem('cesizen_token')).toBeNull()
    })

    it('redirige vers /auth/connexion sur 401', async () => {
      vi.stubGlobal('fetch', mockFetch(401, {}))

      try {
        await api.get('/users/me')
      } catch {
        // attendu
      }

      expect(window.location.href).toBe('/auth/connexion')
    })

    it('lance l\'erreur "Non authentifié" sur 401', async () => {
      vi.stubGlobal('fetch', mockFetch(401, {}))

      await expect(api.get('/users/me')).rejects.toThrow('Non authentifié')
    })
  })

  describe('headers d\'authentification', () => {
    it('inclut le header Authorization quand un token est présent', async () => {
      localStorage.setItem('cesizen_token', 'my-jwt')
      vi.stubGlobal('fetch', mockFetch(200, { data: {} }))

      await api.get('/users/me')

      const callOptions = fetch.mock.calls[0][1]
      expect(callOptions.headers['Authorization']).toBe('Bearer my-jwt')
    })

    it('n\'inclut pas Authorization quand aucun token', async () => {
      vi.stubGlobal('fetch', mockFetch(200, { data: [] }))

      await api.get('/emotions')

      const callOptions = fetch.mock.calls[0][1]
      expect(callOptions.headers['Authorization']).toBeUndefined()
    })
  })
})
