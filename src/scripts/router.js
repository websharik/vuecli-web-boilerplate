import { createMemoryHistory, createRouter } from 'vue-router'
import Home from '@views/Home.vue'

const router = createRouter({
  mode: 'history',
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      component: Home
    }
  ]
})

export default router
