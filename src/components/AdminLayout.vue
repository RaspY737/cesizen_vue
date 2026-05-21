<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <nav aria-label="Navigation administration">
        <p class="admin-nav__title">
          Tableau de bord
        </p>
        <ul class="admin-nav__list">
          <li
            class="admin-nav__item"
            :class="{ active: isActive('/admin') }"
          >
            <router-link to="/admin">
              <span
                class="fr-icon-dashboard-line"
                aria-hidden="true"
              />
              Vue d'ensemble
            </router-link>
          </li>
        </ul>

        <p class="admin-nav__title">
          Gestion
        </p>
        <ul class="admin-nav__list">
          <li
            class="admin-nav__item"
            :class="{ active: isActive('/admin/utilisateurs') }"
          >
            <router-link to="/admin/utilisateurs">
              <span
                class="fr-icon-user-line"
                aria-hidden="true"
              />
              Utilisateurs
            </router-link>
          </li>
          <li
            class="admin-nav__item"
            :class="{ active: isActive('/admin/contenus') }"
          >
            <router-link to="/admin/contenus">
              <span
                class="fr-icon-article-line"
                aria-hidden="true"
              />
              Contenus
            </router-link>
          </li>
          <li
            class="admin-nav__item"
            :class="{ active: isActive('/admin/emotions') }"
          >
            <router-link to="/admin/emotions">
              <span
                class="fr-icon-emotion-line"
                aria-hidden="true"
              />
              Émotions
            </router-link>
          </li>
        </ul>

        <p class="admin-nav__title">
          Système
        </p>
        <ul class="admin-nav__list">
          <li class="admin-nav__item">
            <a href="#">
              <span
                class="fr-icon-settings-5-line"
                aria-hidden="true"
              />
              Paramètres
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="admin-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

function isActive(path) {
  if (path === '/admin') {
    return route.path === '/admin' || route.path === '/admin/'
  }
  return route.path.startsWith(path)
}
</script>
