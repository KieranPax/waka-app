import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import { RHome, RLevel } from '@/views/Radical';
import { KHome, KLevel } from '@/views/Kanji';
import { VHome, VLevel } from '@/views/Vocab';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home },

  { path: '/radical', component: RHome },
  { path: '/radical/l/:levelId', component: RLevel },

  { path: '/kanji', component: KHome },
  { path: '/kanji/l/:levelId', component: KLevel },

  { path: '/vocab', component: VHome },
  { path: '/vocab/l/:levelId', component: VLevel }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
