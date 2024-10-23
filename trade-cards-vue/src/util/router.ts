import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import UserRegister from "../views/UserRegister.vue";
import Partida from "../views/Partida.vue";
import AvailableSessions from "../views/AvailableSessions.vue";
import CreateSession from "../views/CreateSession.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "UserRegister",
    component: UserRegister,
  },
  {
    path: "/partida",
    name: "Partida",
    component: Partida,
  },
  {
    path: "/sessions",
    name: "Sessions",
    component: AvailableSessions,
  },
  {
    path: "/create-session",
    name: "CreateSession",
    component: CreateSession,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
