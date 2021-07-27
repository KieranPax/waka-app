import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import { RHome, RLevel } from '@/views/Radical';
import { KHome, KLevel } from '@/views/Kanji';
import { VHome, VLevel } from '@/views/Vocab';
import { StudyHome, StudyMode } from '@/views/Study';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home },

  { path: '/radical', component: RHome },
  { path: '/radical/l/:levelId', component: RLevel },

  { path: '/kanji', component: KHome },
  { path: '/kanji/l/:levelId', component: KLevel },

  { path: '/vocab', component: VHome },
  { path: '/vocab/l/:levelId', component: VLevel },

  { path: '/study', component: StudyHome },
  { path: '/study/:settings', component: StudyMode }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
