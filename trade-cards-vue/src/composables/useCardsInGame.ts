import { ref, watch } from 'vue';
import { usePartidas } from "./usePartidas";
import { usePlayer } from "./usePlayer";
import { useDeckImages } from '@/composables/useImage';
import { CardType, Cartas } from '@/types';
import { Deck } from '@/type';
import { convertToObject } from 'typescript';

const activeCardsTracking = ref([] as Cartas[]);
const activeDeckCardsBase = ref([] as Cartas[]);
// Reactive deck of cards
export function usePlayerCardTracker() {
  const { getImage } = useDeckImages();
  const { getMyself } = usePlayer();
  const { partida } = usePartidas(getMyself);

  // Function to convert the deck into a list of cards
  function convertDeckToList(deck: Record<string, { count: number, descricao: string, tipo: CardType }>) {
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
        if (activeCardsTracking.value.length === 0) {
          // Initialize the deck
          activeCardsTracking.value = convertDeckToList(newCartasDisponiveis);
        } else {
          // Update the deck based on the new counts
          updateCartasDeck(newCartasDisponiveis, oldCartasDisponiveis || {});
        }
      }
    }
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
        // Remove excess cards from the top of the deck
        const numToRemove = oldCount - newCount;
        let removed = 0;
        for (let i = activeCardsTracking.value.length - 1; i >= 0 && removed < numToRemove; i--) {
          if (activeCardsTracking.value[i].nome === cardName) {
            activeCardsTracking.value.splice(i, 1);
            removed++;
          }
        }
      } else if (newCount > oldCount) {
        // Add new cards to the bottom of the deck
        const numToAdd = newCount - oldCount;
        for (let i = 0; i < numToAdd; i++) {
          activeCardsTracking.value.push({
            nome: cardName,
            descricao: newDeck[cardName].descricao,
            tipo: newDeck[cardName].tipo,
            image: getImage(cardName),
            id: activeCardsTracking.value.length + 1,
          });
        }
      }
      // No action needed if counts are equal
    }
  }

  return { activeCardsTracking, resetDeck };
}
