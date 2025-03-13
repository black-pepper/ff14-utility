
/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import MainView from '@/views/MainView.vue'
import EventView from '../views/EventView.vue'
import MoogleView from '@/views/MoogleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path: '/event',
      name: 'event',
      component: EventView,
    },
    {
      path: '/moogle',
      name: 'moogle',
      component: MoogleView
    },
    { path: '/:catchAll(.*)',
      redirect: '/' },
  ],
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

router.beforeEach((to, from, next) => {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectPath = urlParams.get('redirect');

  if (redirectPath) {
    window.history.replaceState(null, '', import.meta.env.BASE_URL + redirectPath);
    next(redirectPath);
  } else {
    next();
  }
});

export default router
