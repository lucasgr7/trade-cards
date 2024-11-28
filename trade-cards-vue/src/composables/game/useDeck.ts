import { SunDeck, MoonDeck } from "../../util/deckbuilder.class";
import { CartasType, DeckGameType } from "../../type";

export const useDeck = () => {
  const generateDeck = (type?: DeckGameType): CartasType[] => {
    if (!type || type === DeckGameType.Sun) {
      return generateSunDeck();
    }
    else if (type === DeckGameType.Moon) {
      return generateMoonDeck();
    }
    return []
  };

  const generateSunDeck = (): CartasType[] => {
    const deck = new SunDeck('Sun Deck');
    deck.setPercentualBasic(40);
    deck.setPercentualCommon(32);
    deck.setPercentualRare(23);
    deck.setPercentualEpic(5);

    return deck.generateDeck(60);
  }

  const generateMoonDeck = (): CartasType[] => {
    const deck = new MoonDeck('Moon Deck');
    deck.setPercentualBasic(40);
    deck.setPercentualCommon(40);
    deck.setPercentualRare(12);
    deck.setPercentualEpic(8);

    return deck.generateDeck(60);
  }

  return { generateDeck };
};
export { SunDeck as DictCartaType };

