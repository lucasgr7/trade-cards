import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import UserRegister from '../views/UserRegister.vue';
import Partida from '../views/Partida.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'UserRegister',
    component: UserRegister
  },
  {
    path: '/partida',
    name: 'Partida',
    component: Partida
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;