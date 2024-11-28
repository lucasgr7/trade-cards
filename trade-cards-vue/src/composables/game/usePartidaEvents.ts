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

/* 
2 state para gerenciamento dos dados V2

1. store.deck = Deck único do jogador gerado assim que ele passa pelo componente pickDeck.vue
2. CardsInHand (DeckCard.vue) = variável utilizada pelo componente para efeitos de animação de carta sumindo

NOVA FEATURE:
3. Removendo cartas - Garantir que store.deck retire a carta para não reutilizar

<- esquerda [CARTA] direita ->
carta é apagada apenas do CardsInHands (ref interna de componente)

GLOBAL store não é afetada

quando o usuário arrastar para cima a GLOBAL tem que ser efaetada




*/