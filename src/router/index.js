import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/auth'

export async function navigationGuard(to) {
  const token = localStorage.getItem('cesizen_token')

  // Pages tracker nécessitent une authentification
  if (to.path.startsWith('/tracker') && !token) {
    return '/auth/connexion'
  }

  // Pages admin nécessitent un token ET le rôle administrateur
  if (to.path.startsWith('/admin')) {
    if (!token) return '/auth/connexion'
    const auth = useAuthStore()
    if (!auth.user) await auth.fetchProfile()
    if (!auth.isAdmin) return '/erreur?code=403'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(navigationGuard)

export default router
