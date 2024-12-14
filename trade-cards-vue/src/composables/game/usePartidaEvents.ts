import { Cartas } from "@/type";
import { useSerializedStorage } from "@/util/storage";
import { useRouter } from "vue-router";
import { usePartidas } from "../apis/usePartidas";
import { computed } from "vue";
import { usePlayerStore } from "@/state/usePlayerStore";

const selectedActionCard = useSerializedStorage<Cartas | null>('selectedActionCard', null);
const selectedObjectCard = useSerializedStorage<Cartas | null>('selectedObjectCard', null);
const selectedConditionCard = useSerializedStorage<Cartas | null>('selectedConditionCard', null);
export function usePartidaEvents() {
  const router = useRouter()
  const store = usePlayerStore();

  function onLeaveGame() {
    // clear all selected cards
    store.clearBagOfCards();
    router.push('/sessions');
  }



  return {
    onLeaveGame,
    selectedActionCard,
    selectedObjectCard,
  }

}
