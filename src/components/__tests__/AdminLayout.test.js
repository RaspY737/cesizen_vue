import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import AdminLayout from '../AdminLayout.vue'

function mountWithRoute(routePath = '/admin') {
  return mount(AdminLayout, {
    global: {
      stubs: {
        'router-link': {
          template: '<a :href="to"><slot /></a>',
          props: ['to'],
        },
      },
      mocks: {
        $route: { path: routePath },
      },
      provide: {
        // Mock useRoute() pour le composant
      },
    },
    slots: {
      default: '<div class="test-content">Contenu test</div>',
    },
  })
}

// Mock de vue-router pour useRoute
import { vi } from 'vitest'
const mockPath = ref('/admin')
vi.mock('vue-router', () => ({
  useRoute: () => ({ path: mockPath.value }),
}))

describe('AdminLayout', () => {
  it('affiche les liens de navigation', () => {
    const wrapper = mountWithRoute()
    const text = wrapper.text()
    expect(text).toContain('Utilisateurs')
    expect(text).toContain('Contenus')
    expect(text).toContain('Émotions')
    expect(text).toContain('Vue d\'ensemble')
  })

  it('affiche les liens vers les bonnes routes', () => {
    const wrapper = mountWithRoute()
    const links = wrapper.findAll('a[href]')
    const hrefs = links.map((l) => l.attributes('href'))
    expect(hrefs).toContain('/admin')
    expect(hrefs).toContain('/admin/utilisateurs')
    expect(hrefs).toContain('/admin/contenus')
    expect(hrefs).toContain('/admin/emotions')
  })

  it('marque "Vue d\'ensemble" comme actif sur /admin', () => {
    mockPath.value = '/admin'
    const wrapper = mountWithRoute()
    const items = wrapper.findAll('.admin-nav__item')
    // Premier item = Vue d'ensemble
    expect(items[0].classes()).toContain('active')
  })

  it('marque "Utilisateurs" comme actif sur /admin/utilisateurs', () => {
    mockPath.value = '/admin/utilisateurs'
    const wrapper = mountWithRoute()
    const items = wrapper.findAll('.admin-nav__item')
    // Vue d'ensemble ne doit pas être actif
    expect(items[0].classes()).not.toContain('active')
    // Utilisateurs (2e item) doit être actif
    expect(items[1].classes()).toContain('active')
  })

  it('marque "Contenus" comme actif sur /admin/contenus/creer', () => {
    mockPath.value = '/admin/contenus/creer'
    const wrapper = mountWithRoute()
    const items = wrapper.findAll('.admin-nav__item')
    expect(items[2].classes()).toContain('active')
  })

  it('affiche le contenu du slot', () => {
    mockPath.value = '/admin'
    const wrapper = mountWithRoute()
    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Contenu test')
  })

  it('a la structure sidebar + main', () => {
    mockPath.value = '/admin'
    const wrapper = mountWithRoute()
    expect(wrapper.find('.admin-sidebar').exists()).toBe(true)
    expect(wrapper.find('.admin-content').exists()).toBe(true)
  })
})
