/**
 * Tests de non régression - Store Auth
 * Vérifient que les comportements validés ne sont pas cassés
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

describe('auth store - non régression', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('NR: logout puis isAuthenticated reste false après re-lecture', () => {
    const store = useAuthStore()
    store.token = 'some-token'
    store.logout()

    // Re-créer le store (simule un refresh)
    setActivePinia(createPinia())
    const store2 = useAuthStore()
    expect(store2.isAuthenticated).toBe(false)
    expect(store2.token).toBeNull()
  })

  it('NR: changer user ne casse pas isAdmin', () => {
    const store = useAuthStore()

    store.user = { id: 1, role: 'utilisateur' }
    expect(store.isAdmin).toBe(false)

    store.user = { id: 1, role: 'administrateur' }
    expect(store.isAdmin).toBe(true)

    store.user = { id: 2, role: 'utilisateur' }
    expect(store.isAdmin).toBe(false)
  })

  it('NR: token dans localStorage survit à la recréation du store', () => {
    localStorage.setItem('cesizen_token', 'persistent-token')

    setActivePinia(createPinia())
    const store = useAuthStore()
    expect(store.token).toBe('persistent-token')
    expect(store.isAuthenticated).toBe(true)
  })
})
