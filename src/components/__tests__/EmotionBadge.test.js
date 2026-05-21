import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmotionBadge from '../EmotionBadge.vue'

describe('EmotionBadge', () => {
  it('affiche l\'emoji et le label', () => {
    const wrapper = mount(EmotionBadge, {
      props: { emotion: 'Joie', emoji: '😊', label: 'Content' },
    })
    expect(wrapper.text()).toContain('😊')
    expect(wrapper.text()).toContain('Content')
  })

  it('applique la classe emotion-badge--joie pour "Joie"', () => {
    const wrapper = mount(EmotionBadge, {
      props: { emotion: 'Joie' },
    })
    expect(wrapper.classes()).toContain('emotion-badge--joie')
  })

  it('applique la classe emotion-badge--colere pour "Colère" (accent normalisé)', () => {
    const wrapper = mount(EmotionBadge, {
      props: { emotion: 'Colère' },
    })
    expect(wrapper.classes()).toContain('emotion-badge--colere')
  })

  it('applique la classe emotion-badge--degout pour "Dégoût" (accents normalisés)', () => {
    const wrapper = mount(EmotionBadge, {
      props: { emotion: 'Dégoût' },
    })
    expect(wrapper.classes()).toContain('emotion-badge--degout')
  })

  it('applique la classe emotion-badge--peur pour "Peur"', () => {
    const wrapper = mount(EmotionBadge, {
      props: { emotion: 'Peur' },
    })
    expect(wrapper.classes()).toContain('emotion-badge--peur')
  })

  it('applique la classe emotion-badge--tristesse pour "Tristesse"', () => {
    const wrapper = mount(EmotionBadge, {
      props: { emotion: 'Tristesse' },
    })
    expect(wrapper.classes()).toContain('emotion-badge--tristesse')
  })

  it('applique la classe emotion-badge--surprise pour "Surprise"', () => {
    const wrapper = mount(EmotionBadge, {
      props: { emotion: 'Surprise' },
    })
    expect(wrapper.classes()).toContain('emotion-badge--surprise')
  })

  it('retombe sur joie pour une émotion inconnue', () => {
    const wrapper = mount(EmotionBadge, {
      props: { emotion: 'Inconnu' },
    })
    expect(wrapper.classes()).toContain('emotion-badge--joie')
  })

  it('est insensible à la casse', () => {
    const wrapper = mount(EmotionBadge, {
      props: { emotion: 'TRISTESSE' },
    })
    expect(wrapper.classes()).toContain('emotion-badge--tristesse')
  })

  it('utilise des valeurs par défaut vides pour emoji et label', () => {
    const wrapper = mount(EmotionBadge, {
      props: { emotion: 'Joie' },
    })
    expect(wrapper.text().trim()).toBe('')
  })
})
