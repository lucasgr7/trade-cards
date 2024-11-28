import { Cartas } from "@/type";
import { useSerializedStorage } from "@/util/storage";
import { useRouter } from "vue-router";
import { usePartidas } from "../apis/usePartidas";
import { CardType } from "@/enums/cardType";
import { computed } from "vue";
import { usePlayerStore } from "@/state/usePlayerStore";

const selectedActionCard = useSerializedStorage<Cartas | null>('selectedActionCard', null);
const selectedObjectCard = useSerializedStorage<Cartas | null>('selectedObjectCard', null);
const selectedConditionCard = useSerializedStorage<Cartas | null>('selectedConditionCard', null);
export function usePartidaEvents() {
  const router = useRouter()
  const store = usePlayerStore();
  const { resetDeckStateAddingActionResetDeck } = usePartidas(store.getMyself);


  const allCardsSelected = computed(() => {
    return (
      selectedActionCard.value !== null &&
      selectedObjectCard.value !== null &&
      selectedConditionCard.value !== null
    );
  });
  function onLeaveGame() {
    // clear all selected cards
    selectedActionCard.value = null;
    selectedObjectCard.value = null;
    selectedConditionCard.value = null;
    router.push('/sessions');
  }


  function clearSelectedCards() {
    selectedActionCard.value = null;
    selectedObjectCard.value = null;
    selectedConditionCard.value = null;
  }

  function onResetDeckBuilding() {
    clearSelectedCards();
    resetDeckStateAddingActionResetDeck();
  }

  return {
    onLeaveGame,
    allCardsSelected,
    selectedActionCard,
    selectedObjectCard,
    selectedConditionCard,
    clearSelectedCards,
    onResetDeckBuilding
  }

}
