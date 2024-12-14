import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import UserRegister from "@/views/UserRegister.vue";
import Partida from "@/views/Partida.vue";
import AvailableSessions from "@/views/AvailableSessions.vue";
import CreateSession from "@/views/CreateSession.vue";
import WaitingRoom from "@/views/WaitingRoom.vue";
import PickDeckView from "@/views/PickDeckView.vue";
import ShowCommand from "@/views/ShowCommand.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "UserRegister",
    component: UserRegister,
  },
  {
    path: "/match/:id",
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
  {
    path: "/pick-deck/:id",
    name: "PickDeck",
    component: PickDeckView,
  },
  {
    path: "/show-command/:id",
    name: "ShowCommand",
    component: ShowCommand,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
