import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import { RHome, RLevel } from '@/views/Radical';
import { KHome } from '@/views/Kanji';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home },

  { path: '/radical', component: RHome },
  { path: '/radical/l/:levelId', component: RLevel },

  { path: '/kanji', component: KHome },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
