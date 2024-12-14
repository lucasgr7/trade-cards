import { TradingCard } from "@/type";
import { useSerializedStorage } from "@/util/storage";
import { useRouter } from "vue-router";
import { usePlayerStore } from "@/state/usePlayerStore";

const selectedActionCard = useSerializedStorage<TradingCard | null>('selectedActionCard', null);
const selectedObjectCard = useSerializedStorage<TradingCard | null>('selectedObjectCard', null);
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
