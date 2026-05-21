/**
 * Tests unitaires - Guards de navigation
 * Testent la vraie fonction navigationGuard exportée depuis router/index.js
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock du module api pour contrôler fetchProfile
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock de vue-router/auto-routes pour éviter l'erreur d'import
vi.mock('vue-router/auto-routes', () => ({
  routes: [],
}))

// Mock de vue-router pour éviter l'initialisation complète du router
vi.mock('vue-router', () => ({
  createRouter: vi.fn(() => ({
    beforeEach: vi.fn(),
  })),
  createWebHistory: vi.fn(),
}))

import { navigationGuard } from '../index'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'

describe('guards de navigation', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('routes protégées sans token', () => {
    it('/tracker redirige vers /auth/connexion sans token', async () => {
      expect(await navigationGuard({ path: '/tracker' })).toBe('/auth/connexion')
    })

    it('/tracker/historique redirige vers /auth/connexion sans token', async () => {
      expect(await navigationGuard({ path: '/tracker/historique' })).toBe('/auth/connexion')
    })

    it('/tracker/ajouter redirige vers /auth/connexion sans token', async () => {
      expect(await navigationGuard({ path: '/tracker/ajouter' })).toBe('/auth/connexion')
    })

    it('/admin redirige vers /auth/connexion sans token', async () => {
      expect(await navigationGuard({ path: '/admin' })).toBe('/auth/connexion')
    })

    it('/admin/utilisateurs redirige vers /auth/connexion sans token', async () => {
      expect(await navigationGuard({ path: '/admin/utilisateurs' })).toBe('/auth/connexion')
    })
  })

  describe('routes protégées avec token', () => {
    beforeEach(() => {
      localStorage.setItem('cesizen_token', 'valid-token')
    })

    it('/tracker est accessible avec un token', async () => {
      expect(await navigationGuard({ path: '/tracker' })).toBeUndefined()
    })

    it('/admin est accessible avec un token admin', async () => {
      const store = useAuthStore()
      store.user = { id: 1, role: 'administrateur' }
      expect(await navigationGuard({ path: '/admin' })).toBeUndefined()
    })

    it('/admin redirige vers / avec un token utilisateur standard', async () => {
      api.get.mockResolvedValueOnce({ data: { id: 2, role: 'utilisateur' } })
      expect(await navigationGuard({ path: '/admin' })).toBe('/')
    })

    it('/admin charge le profil si user est null', async () => {
      api.get.mockResolvedValueOnce({ data: { id: 1, role: 'administrateur' } })
      const store = useAuthStore()
      expect(store.user).toBeNull()

      await navigationGuard({ path: '/admin' })

      expect(api.get).toHaveBeenCalledWith('/users/me')
    })
  })

  describe('routes publiques sans token', () => {
    it('/ est accessible sans token', async () => {
      expect(await navigationGuard({ path: '/' })).toBeUndefined()
    })

    it('/informations est accessible sans token', async () => {
      expect(await navigationGuard({ path: '/informations' })).toBeUndefined()
    })

    it('/auth/connexion est accessible sans token', async () => {
      expect(await navigationGuard({ path: '/auth/connexion' })).toBeUndefined()
    })

    it('/auth/inscription est accessible sans token', async () => {
      expect(await navigationGuard({ path: '/auth/inscription' })).toBeUndefined()
    })
  })
})
