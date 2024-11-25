import { SunDeck } from "../../util/deckbuilder.class";
import { CartasType, DeckGameType } from "../../type";

export const useDeck = () => {
  const generateDeck = (type?: DeckGameType): CartasType[]  => {
    if (!type || type === DeckGameType.Sun) {
      return generateSunDeck();
    }
    else if(type === DeckGameType.Moon){
      return generateMoonDeck();
    }
    return []
  };

  const generateSunDeck = (): CartasType[] => {
    const deck = new SunDeck('Sun Deck');
    return deck.generateDeck(51);
  }

  const generateMoonDeck = (): CartasType[] => {
    const deck = new SunDeck('Moon Deck');
    deck.setPercentualCommon(0.6);
    deck.setPercentualRare(0.3);
    deck.setPercentualEpic(0.1);
    return deck.generateDeck(51);
  }

  return { generateDeck };
};
export { SunDeck as DictCartaType };

