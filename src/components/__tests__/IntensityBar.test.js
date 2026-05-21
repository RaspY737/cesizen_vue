import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IntensityBar from '../IntensityBar.vue'

describe('IntensityBar', () => {
  it('affiche 10 segments', () => {
    const wrapper = mount(IntensityBar, {
      props: { intensity: 5 },
    })
    expect(wrapper.findAll('.intensity-bar__segment')).toHaveLength(10)
  })

  it('marque le bon nombre de segments actifs pour intensity=5', () => {
    const wrapper = mount(IntensityBar, {
      props: { intensity: 5 },
    })
    const active = wrapper.findAll('.intensity-bar__segment.active')
    expect(active).toHaveLength(5)
  })

  it('affiche le texte "5/10"', () => {
    const wrapper = mount(IntensityBar, {
      props: { intensity: 5 },
    })
    expect(wrapper.text()).toContain('5/10')
  })

  it('marque 1 segment actif pour intensity=1', () => {
    const wrapper = mount(IntensityBar, {
      props: { intensity: 1 },
    })
    expect(wrapper.findAll('.intensity-bar__segment.active')).toHaveLength(1)
  })

  it('marque 10 segments actifs pour intensity=10', () => {
    const wrapper = mount(IntensityBar, {
      props: { intensity: 10 },
    })
    expect(wrapper.findAll('.intensity-bar__segment.active')).toHaveLength(10)
  })

  it('a le title "X/10"', () => {
    const wrapper = mount(IntensityBar, {
      props: { intensity: 7 },
    })
    expect(wrapper.attributes('title')).toBe('7/10')
  })
})
