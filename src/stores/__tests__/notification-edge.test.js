/**
 * Tests cas limites - Notification Store
 * Vérifient le comportement aux frontières et documentent le bug timer
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from '../notification'

describe('notification store - cas limites', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it('un second show() met à jour le message', () => {
    const store = useNotificationStore()
    store.show('Premier message', 'success')
    store.show('Second message', 'error')

    expect(store.message).toBe('Second message')
    expect(store.type).toBe('error')
    expect(store.visible).toBe(true)
  })

  // FIX : clearTimeout dans show() annule le timer précédent
  it('un second show() relance le timer de 5s (ancien bug corrigé)', () => {
    const store = useNotificationStore()

    store.show('Premier')
    vi.advanceTimersByTime(3000) // t=3s
    store.show('Second')        // relance show() à t=3s

    vi.advanceTimersByTime(2000) // t=5s → le premier timer a été annulé
    expect(store.visible).toBe(true) // le second timer expire à t=8s

    vi.advanceTimersByTime(3000) // t=8s → le second timer se déclenche
    expect(store.visible).toBe(false)
  })

  it('show() avec un message vide fonctionne', () => {
    const store = useNotificationStore()
    store.show('')
    expect(store.visible).toBe(true)
    expect(store.message).toBe('')
  })

  it('show() avec un très long message (1000 caractères)', () => {
    const store = useNotificationStore()
    const longMsg = 'A'.repeat(1000)
    store.show(longMsg)
    expect(store.message).toBe(longMsg)
    expect(store.message).toHaveLength(1000)
  })

  it('show() avec type undefined utilise le défaut "success"', () => {
    const store = useNotificationStore()
    store.show('Test', undefined)
    expect(store.type).toBe('success')
  })

  it('hide() quand déjà masqué reste masqué sans erreur', () => {
    const store = useNotificationStore()
    expect(store.visible).toBe(false)
    store.hide()
    expect(store.visible).toBe(false)
  })
})
