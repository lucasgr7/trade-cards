import { computed } from "vue";
import { usePartidas } from "./usePartidas";
import { usePlayer } from "./usePlayer";
import { useDeckImages } from '@/composables/useImage';
import { CardType } from '@/types';

export function useCardsInGame() {
  const { getImage } = useDeckImages();
  const { getMyself } = usePlayer();
  const { partida } = usePartidas(getMyself);

  // Função para converter o Deck em uma lista de cartas
  function convertDeckToList(deck: Record<string, { descricao: string; tipo: CardType; count: number }>): Array<any> {
    const lista: Array<any> = [];
    let count = 1;
    for (const [cardName, cardInfo] of Object.entries(deck)) {
      for (let i = 0; i < cardInfo.count; i++) {
        lista.push({
          nome: cardName,
          descricao: cardInfo.descricao,
          tipo: cardInfo.tipo,
          image: getImage(cardName),
          id: count
          // Adicione outras propriedades necessárias aqui
        });
        count++;
      }
    }
    // shuffle
    lista.sort(() => Math.random() - 0.5);

    return lista;
  }

  // Lista de cartas para o CardDeck
  const cartasDeck = computed(() => {
    if(!partida?.value){
      return [];
    }
    if(partida.value.cartas_disponiveis){
      return convertDeckToList(partida.value.cartas_disponiveis);
    }else{
      return [];
    }
  }); // Ajuste o tipo conforme necessário

  return { cartasDeck };
}