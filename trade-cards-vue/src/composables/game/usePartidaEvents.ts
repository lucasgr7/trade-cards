import { Cartas } from "@/type";
import { useSerializedStorage } from "@/util/storage";
import { useRouter } from "vue-router";
import { usePartidas } from "../apis/usePartidas";
import { CardType } from "@/enums/cardType";
import { computed } from "vue";
import { usePlayer } from "../state/usePlayer";

const selectedActionCard = useSerializedStorage<Cartas | null>('selectedActionCard', null);
const selectedObjectCard = useSerializedStorage<Cartas | null>('selectedObjectCard', null);
const selectedConditionCard = useSerializedStorage<Cartas | null>('selectedConditionCard', null);
export function usePartidaEvents() {
  const router = useRouter()
  const { getMyself } = usePlayer();
  const {  usarCarta  } = usePartidas(getMyself);;

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

  function onPlayCard(carta: Cartas) {
    usarCarta(carta);
    const cartaTipo = carta.tipo.toLowerCase();
  
    const cardMap = {
      [CardType.Action.toLowerCase()]: selectedActionCard,
      [CardType.Object.toLowerCase()]: selectedObjectCard,
      [CardType.Condition.toLowerCase()]: selectedConditionCard,
    };
  
    const selectedCard = cardMap[cartaTipo];
  
    if (!selectedCard || selectedCard.value) {
      alert('Você já escolheu uma carta desse tipo.');
      return;
    }
  
    selectedCard.value = carta;
  }

  return {
    onLeaveGame,
    onPlayCard,
    allCardsSelected,
    selectedActionCard,
    selectedObjectCard,
    selectedConditionCard
  }
  
}