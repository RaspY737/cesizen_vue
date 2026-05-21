import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('starts unauthenticated when no token in localStorage', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
  })

  it('starts authenticated when token exists in localStorage', () => {
    localStorage.setItem('cesizen_token', 'existing-token')
    setActivePinia(createPinia())
    const store = useAuthStore()
    expect(store.token).toBe('existing-token')
    expect(store.isAuthenticated).toBe(true)
  })

  it('isAdmin is false when user is null', () => {
    const store = useAuthStore()
    expect(store.isAdmin).toBe(false)
  })

  it('isAdmin is true when user role is administrateur', () => {
    const store = useAuthStore()
    store.user = { id: 1, email: 'admin@test.fr', role: 'administrateur' }
    expect(store.isAdmin).toBe(true)
  })

  it('isAdmin is false when user role is utilisateur', () => {
    const store = useAuthStore()
    store.user = { id: 2, email: 'user@test.fr', role: 'utilisateur' }
    expect(store.isAdmin).toBe(false)
  })

  it('logout clears token, user, and localStorage', () => {
    const store = useAuthStore()
    store.token = 'some-token'
    store.user = { id: 1, email: 'test@test.fr', role: 'utilisateur' }
    localStorage.setItem('cesizen_token', 'some-token')

    store.logout()

    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('cesizen_token')).toBeNull()
  })
})
