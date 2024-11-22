import { ref, watch } from 'vue';
import { usePartidas } from "../apis/usePartidas";
import { usePlayer } from "../state/usePlayer";
import { useDeckImages } from '@/composables/utils/useImage';
import { CardType  } from '@/enums/cardType';
import { Deck, Cartas} from '@/type';
import { PartidaAcoes } from '@/enums/partidas.actions';

const activeCardsTracking = ref([] as Cartas[]);
const activeDeckCardsBase = ref({} as Deck);
// Reactive deck of cards
export function usePlayerCardTracker() {
  const { getImage } = useDeckImages();
  const { getMyself } = usePlayer();
  const { partida } = usePartidas(getMyself);

  // Function to convert the deck into a list of cards
  function convertDeckToList(deck: Deck): Cartas[] {
    const lista = [];
    let count = 1;
    for (const [cardName, cardInfo] of Object.entries(deck)) {
      for (let i = 0; i < cardInfo.count; i++) {
        lista.push({
          nome: cardName,
          descricao: cardInfo.descricao,
          tipo: cardInfo.tipo,
          image: getImage(cardName),
          id: count,
          isGenerative: false,
        } as Cartas);
        count++;
      }
    }

    // randomize the deck
    lista.sort(() => Math.random() - 0.5);
    return lista;
  }

  // Watch for changes in cartas_disponiveis
  watch(
    partida,
    (newPartida, oldPartida) => {
      const newCartasDisponiveis = newPartida?.cartas_disponiveis;
      const oldCartasDisponiveis = oldPartida?.cartas_disponiveis;
      if (newCartasDisponiveis) {
        activeDeckCardsBase.value = newCartasDisponiveis;
  
        // Verificar se a última ação é 'reset_deck'
        const lastAction = newPartida.acoes[newPartida.acoes.length - 1];
        if (lastAction?.acao === PartidaAcoes.resetDeck) {
          // Resetar o deck apenas se for uma ação de reset
          activeCardsTracking.value = convertDeckToList(newCartasDisponiveis);
        } else {
          // Atualizar o deck sem reset completo
          updateCartasDeck(newCartasDisponiveis, oldCartasDisponiveis || {});
        }
      }
    },
    { immediate: true }
  );

  function resetDeck() {
    activeCardsTracking.value = convertDeckToList(activeDeckCardsBase.value);
  }

  // Function to update the deck
  function updateCartasDeck(newDeck: Deck, oldDeck: Deck) {
    for (const cardName in newDeck) {
      const newCount = newDeck[cardName].count;
      const oldCount = oldDeck[cardName]?.count || 0;
  
      if (newCount < oldCount) {
        // Número de cartas a serem removidas
        const numToRemove = oldCount - newCount;
        let removed = 0;
        for (let i = activeCardsTracking.value.length - 1; i >= 0 && removed < numToRemove; i--) {
          if (activeCardsTracking.value[i].nome === cardName) {
            activeCardsTracking.value.splice(i, 1);
            removed++;
          }
        }
      } else if (newCount > oldCount) {
        // Número de cartas a serem adicionadas
        const numToAdd = newCount - oldCount;
        for (let i = 0; i < numToAdd; i++) {
          activeCardsTracking.value.push({
            nome: cardName,
            descricao: newDeck[cardName].descricao,
            tipo: newDeck[cardName].tipo,
            image: getImage(cardName),
            id: activeCardsTracking.value.length + 1,
            isGenerative: false,
          } as Cartas);
        }
      }
      // Se a contagem for igual, nenhuma ação é necessária
    }
  }

  return { activeCardsTracking, resetDeck };
}
