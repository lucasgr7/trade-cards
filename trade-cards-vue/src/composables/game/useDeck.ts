import { SunDeck, MoonDeck } from "../../util/deckbuilder.class";
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
    deck.setPercentualBasic(50);
    deck.setPercentualCommon(25);
    deck.setPercentualRare(20);
    deck.setPercentualEpic(5);

    return deck.generateDeck(50);
  }

  const generateMoonDeck = (): CartasType[] => {
    const deck = new MoonDeck('Moon Deck');
    deck.setPercentualBasic(50);
    deck.setPercentualCommon(30);
    deck.setPercentualRare(22);
    deck.setPercentualEpic(8);

    return deck.generateDeck(50);
  }

  return { generateDeck };
};
export { SunDeck as DictCartaType };

