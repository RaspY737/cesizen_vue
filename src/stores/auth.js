import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('cesizen_token'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'administrateur')

  async function login(email, mot_de_passe) {
    const data = await api.post('/auth/login', { email, mot_de_passe })
    token.value = data.data.token
    localStorage.setItem('cesizen_token', data.data.token)
    user.value = data.data.user
  }

  async function register(payload) {
    const data = await api.post('/auth/register', payload)
    token.value = data.data.token
    localStorage.setItem('cesizen_token', data.data.token)
    user.value = data.data.user
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      const data = await api.get('/users/me')
      user.value = data.data
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('cesizen_token')
  }

  return { user, token, isAuthenticated, isAdmin, login, register, fetchProfile, logout }
})
