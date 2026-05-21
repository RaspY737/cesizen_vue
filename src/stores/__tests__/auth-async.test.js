/**
 * Tests unitaires - Auth Store (méthodes asynchrones)
 * Testent login(), register(), fetchProfile() avec mock du service API
 */
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

import { api } from '@/services/api'
import { useAuthStore } from '../auth'

describe('auth store - méthodes asynchrones', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('login()', () => {
    const loginResponse = {
      data: {
        token: 'jwt-token-123',
        user: { id: 1, email: 'user@test.fr', role: 'utilisateur' },
      },
    }

    it('stocke le token et le user en cas de succès', async () => {
      api.post.mockResolvedValueOnce(loginResponse)
      const store = useAuthStore()

      await store.login('user@test.fr', 'password123')

      expect(store.token).toBe('jwt-token-123')
      expect(store.user).toEqual({ id: 1, email: 'user@test.fr', role: 'utilisateur' })
      expect(store.isAuthenticated).toBe(true)
    })

    it('persiste le token dans localStorage', async () => {
      api.post.mockResolvedValueOnce(loginResponse)
      const store = useAuthStore()

      await store.login('user@test.fr', 'password123')

      expect(localStorage.getItem('cesizen_token')).toBe('jwt-token-123')
    })

    it('appelle api.post avec les bons paramètres', async () => {
      api.post.mockResolvedValueOnce(loginResponse)
      const store = useAuthStore()

      await store.login('user@test.fr', 'password123')

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'user@test.fr',
        mot_de_passe: 'password123',
      })
    })

    it('propage l\'erreur si l\'API rejette', async () => {
      api.post.mockRejectedValueOnce(new Error('Email ou mot de passe incorrect'))
      const store = useAuthStore()

      await expect(store.login('user@test.fr', 'wrong')).rejects.toThrow(
        'Email ou mot de passe incorrect',
      )
    })

    it('ne modifie pas l\'état en cas d\'erreur API', async () => {
      api.post.mockRejectedValueOnce(new Error('Erreur'))
      const store = useAuthStore()

      try {
        await store.login('user@test.fr', 'wrong')
      } catch {
        // attendu
      }

      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('register()', () => {
    const registerResponse = {
      data: {
        token: 'jwt-register-456',
        user: { id: 2, email: 'new@test.fr', role: 'utilisateur' },
      },
    }

    it('stocke le token et le user en cas de succès', async () => {
      api.post.mockResolvedValueOnce(registerResponse)
      const store = useAuthStore()

      await store.register({
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'new@test.fr',
        mot_de_passe: 'Secure123!',
      })

      expect(store.token).toBe('jwt-register-456')
      expect(store.user).toEqual({ id: 2, email: 'new@test.fr', role: 'utilisateur' })
    })

    it('persiste le token dans localStorage', async () => {
      api.post.mockResolvedValueOnce(registerResponse)
      const store = useAuthStore()

      await store.register({
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'new@test.fr',
        mot_de_passe: 'Secure123!',
      })

      expect(localStorage.getItem('cesizen_token')).toBe('jwt-register-456')
    })

    it('propage l\'erreur si l\'email existe déjà', async () => {
      api.post.mockRejectedValueOnce(new Error('Un compte avec cet email existe déjà'))
      const store = useAuthStore()

      await expect(
        store.register({
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'existing@test.fr',
          mot_de_passe: 'Secure123!',
        }),
      ).rejects.toThrow('Un compte avec cet email existe déjà')
    })
  })

  describe('fetchProfile()', () => {
    it('charge le profil utilisateur depuis l\'API', async () => {
      const store = useAuthStore()
      store.token = 'valid-token'
      api.get.mockResolvedValueOnce({
        data: { id: 1, email: 'user@test.fr', nom: 'Dupont', prenom: 'Jean', role: 'utilisateur' },
      })

      await store.fetchProfile()

      expect(store.user).toEqual({
        id: 1,
        email: 'user@test.fr',
        nom: 'Dupont',
        prenom: 'Jean',
        role: 'utilisateur',
      })
      expect(api.get).toHaveBeenCalledWith('/users/me')
    })

    it('appelle logout si l\'API retourne une erreur', async () => {
      const store = useAuthStore()
      store.token = 'expired-token'
      localStorage.setItem('cesizen_token', 'expired-token')
      api.get.mockRejectedValueOnce(new Error('Non authentifié'))

      await store.fetchProfile()

      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(localStorage.getItem('cesizen_token')).toBeNull()
    })

    it('ne fait rien si aucun token n\'est présent', async () => {
      const store = useAuthStore()

      await store.fetchProfile()

      expect(api.get).not.toHaveBeenCalled()
      expect(store.user).toBeNull()
    })
  })
})
