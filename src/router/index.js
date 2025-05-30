import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipesView from '../views/RecipesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: RecipesView,
      meta: {
        title: 'Recipes',
      },
    },
  ],
})

router.beforeEach((to) => {
  const { title } = to.meta;
  const defaultTitle = 'My Home Planner';
  if (title) {
    document.title = defaultTitle + " - "  + title;
  } else {
    document.title = defaultTitle;
  }
});

export default router
