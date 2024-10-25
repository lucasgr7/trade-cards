import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import UserRegister from "../views/UserRegister.vue";
import Partida from "../views/Partida.vue";
import AvailableSessions from "../views/AvailableSessions.vue";
import CreateSession from "../views/CreateSession.vue";
import WaitingRoom from "../views/WaitingRoom.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "UserRegister",
    component: UserRegister,
  },
  {
    path: "/partida/:id",
    name: "Partida",
    component: Partida,
    props: true,
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
  {
    path: "/waiting-room/:id",
    name: "WaitingRoom",
    component: WaitingRoom,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
