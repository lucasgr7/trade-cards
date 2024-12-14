import { TradingCard } from "@/type";
import { DeckBuilder } from "@/util/deckbuilder.class";

export const useDeck = () => {
  const generateDeck = (numberRounds: number): TradingCard[] => {
    const deck = new DeckBuilder().withNumberOfRounds(numberRounds).build();
    return deck;
  };

  return { generateDeck };
};
