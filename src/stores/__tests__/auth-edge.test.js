/**
 * Tests cas limites - Auth Store
 * Vérifient le comportement aux frontières (rôles invalides, double logout, etc.)
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

describe('auth store - cas limites', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('isAdmin est false avec un rôle contenant des espaces " administrateur "', () => {
    const store = useAuthStore()
    store.user = { id: 1, role: ' administrateur ' }
    expect(store.isAdmin).toBe(false)
  })

  it('isAdmin est false avec un rôle undefined', () => {
    const store = useAuthStore()
    store.user = { id: 1, role: undefined }
    expect(store.isAdmin).toBe(false)
  })

  it('double logout ne lance pas d\'erreur', () => {
    const store = useAuthStore()
    store.token = 'token'
    store.logout()
    expect(() => store.logout()).not.toThrow()
    expect(store.token).toBeNull()
  })

  it('un token vide "" donne isAuthenticated = false', () => {
    const store = useAuthStore()
    store.token = ''
    expect(store.isAuthenticated).toBe(false)
  })

  it('isAdmin est false quand user n\'a pas de propriété role', () => {
    const store = useAuthStore()
    store.user = { id: 1, email: 'test@test.fr' }
    expect(store.isAdmin).toBe(false)
  })
})
