/**
 * Tests cas limites - Service API (buildHeaders, getToken)
 * Vérifient le comportement aux frontières et la sécurité des entrées
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { getToken, buildHeaders } from '../api'

describe('api service - cas limites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('buildHeaders permet d\'override Content-Type via extra headers', () => {
    const headers = buildHeaders({ 'Content-Type': 'multipart/form-data' })
    expect(headers['Content-Type']).toBe('multipart/form-data')
  })

  it('getToken retourne une chaîne vide si localStorage a un token vide', () => {
    localStorage.setItem('cesizen_token', '')
    expect(getToken()).toBe('')
  })

  it('buildHeaders avec un token contenant des caractères spéciaux', () => {
    localStorage.setItem('cesizen_token', 'eyJ+/=.special-chars!@#$%')
    const headers = buildHeaders()
    expect(headers['Authorization']).toBe('Bearer eyJ+/=.special-chars!@#$%')
  })

  it('buildHeaders avec une valeur XSS dans le token la passe telle quelle', () => {
    localStorage.setItem('cesizen_token', '<script>alert(1)</script>')
    const headers = buildHeaders()
    expect(headers['Authorization']).toBe('Bearer <script>alert(1)</script>')
  })

  it('deux appels à buildHeaders retournent des objets indépendants', () => {
    const headers1 = buildHeaders()
    const headers2 = buildHeaders()
    headers1['X-Custom'] = 'modified'
    expect(headers2['X-Custom']).toBeUndefined()
  })

  it('les extra headers n\'écrasent pas Content-Type sauf si explicitement fourni', () => {
    const headers = buildHeaders({ 'X-Request-Id': '123' })
    expect(headers['Content-Type']).toBe('application/json')
    expect(headers['X-Request-Id']).toBe('123')
  })
})
