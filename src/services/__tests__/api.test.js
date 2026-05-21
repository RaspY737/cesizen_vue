import { describe, it, expect, beforeEach } from 'vitest'
import { getToken, buildHeaders } from '../api'

describe('api service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getToken', () => {
    it('returns null when no token in localStorage', () => {
      expect(getToken()).toBeNull()
    })

    it('returns the token from localStorage', () => {
      localStorage.setItem('cesizen_token', 'my-jwt-token')
      expect(getToken()).toBe('my-jwt-token')
    })
  })

  describe('buildHeaders', () => {
    it('includes Content-Type by default', () => {
      const headers = buildHeaders()
      expect(headers['Content-Type']).toBe('application/json')
    })

    it('does not include Authorization when no token', () => {
      const headers = buildHeaders()
      expect(headers['Authorization']).toBeUndefined()
    })

    it('includes Authorization Bearer when token exists', () => {
      localStorage.setItem('cesizen_token', 'my-jwt-token')
      const headers = buildHeaders()
      expect(headers['Authorization']).toBe('Bearer my-jwt-token')
    })

    it('merges extra headers', () => {
      const headers = buildHeaders({ 'X-Custom': 'value' })
      expect(headers['X-Custom']).toBe('value')
      expect(headers['Content-Type']).toBe('application/json')
    })
  })
})
