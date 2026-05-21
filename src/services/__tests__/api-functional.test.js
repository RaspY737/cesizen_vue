/**
 * Tests fonctionnels - Service API
 * Vérifient le comportement du service dans des scénarios réalistes
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { getToken, buildHeaders } from '../api'

describe('api service - tests fonctionnels', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('F: simule un flow login → headers → logout → headers', () => {
    // Pas de token au départ
    expect(buildHeaders()['Authorization']).toBeUndefined()

    // Simule login : stocke le token
    localStorage.setItem('cesizen_token', 'jwt-after-login')
    expect(buildHeaders()['Authorization']).toBe('Bearer jwt-after-login')
    expect(getToken()).toBe('jwt-after-login')

    // Simule logout : supprime le token
    localStorage.removeItem('cesizen_token')
    expect(buildHeaders()['Authorization']).toBeUndefined()
    expect(getToken()).toBeNull()
  })

  it('F: le token change entre deux appels', () => {
    localStorage.setItem('cesizen_token', 'token-1')
    expect(buildHeaders()['Authorization']).toBe('Bearer token-1')

    localStorage.setItem('cesizen_token', 'token-2')
    expect(buildHeaders()['Authorization']).toBe('Bearer token-2')
  })

  it('F: Content-Type est toujours présent même après manipulation du token', () => {
    localStorage.setItem('cesizen_token', 'some-token')
    let headers = buildHeaders()
    expect(headers['Content-Type']).toBe('application/json')

    localStorage.removeItem('cesizen_token')
    headers = buildHeaders()
    expect(headers['Content-Type']).toBe('application/json')
  })
})
