import Vue from 'vue';
import Router from 'vue-router';
import Plan from './views/Plan.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'plan',
      component: Plan,
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: () => import(/* webpackChunkName: "about" */ './views/Recipes.vue'),
    },
    {
      path: '/recipe/:id',
      name: 'recipe',
      component: () => import(/* webpackChunkName: "about" */ './views/Recipe.vue'),
    },
  ],
});
