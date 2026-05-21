import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from '../notification'

describe('notification store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it('starts hidden', () => {
    const store = useNotificationStore()
    expect(store.visible).toBe(false)
    expect(store.message).toBe('')
  })

  it('show() makes notification visible with correct message and type', () => {
    const store = useNotificationStore()
    store.show('Succès !', 'success')
    expect(store.visible).toBe(true)
    expect(store.message).toBe('Succès !')
    expect(store.type).toBe('success')
  })

  it('show() defaults to success type', () => {
    const store = useNotificationStore()
    store.show('Message')
    expect(store.type).toBe('success')
  })

  it('show() with error type', () => {
    const store = useNotificationStore()
    store.show('Erreur !', 'error')
    expect(store.type).toBe('error')
    expect(store.visible).toBe(true)
  })

  it('hide() makes notification invisible', () => {
    const store = useNotificationStore()
    store.show('Test')
    store.hide()
    expect(store.visible).toBe(false)
  })

  it('auto-hides after 5 seconds', () => {
    const store = useNotificationStore()
    store.show('Auto-hide test')
    expect(store.visible).toBe(true)

    vi.advanceTimersByTime(5000)
    expect(store.visible).toBe(false)
  })
})
