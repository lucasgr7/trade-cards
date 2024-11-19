import { DeckBuilder, DictCartaType } from "../util/deckbuilder.class";
import { Salas } from "./useSalas";
import { Deck } from "type";

export const useDeck = () => {
  const generateDeck = (Sala: Salas, numeroTurnos: number): Deck => {
    const deckBuilder = new DeckBuilder();
    const totalPlayers = Sala.jogadores.length;
    const totalCardsPerDeck = numeroTurnos * totalPlayers;

    // 1. Generate Action Deck
    const actionTotal = totalCardsPerDeck;
    const actionTrocaCount = Math.floor(actionTotal * 0.75);
    const actionRevelarCount = actionTotal - actionTrocaCount;

    deckBuilder
      .addCard(DictCartaType.actions.troca, actionTrocaCount)
      .addCard(DictCartaType.actions.revelar, actionRevelarCount);

    // 2. Generate Object Deck
    const objectTotal = totalCardsPerDeck;
    const objectPresenteCount = Math.floor(objectTotal * 0.6);
    const objectAssentoCount = objectTotal - objectPresenteCount;

    deckBuilder
      .addCard(DictCartaType.objects.presente, objectPresenteCount)
      .addCard(DictCartaType.objects.assento, objectAssentoCount);

    // 3. Generate Condition Deck
    const conditionTotal = totalCardsPerDeck;

    // 3.1. Add Player-Specific Condition Cards
    deckBuilder.addPlayerConditionCards(Sala, totalPlayers);

    // 3.2. Add General Specific Condition Cards
    deckBuilder.addGeneralSpecificCards(conditionTotal);

    // 3.3. Add Remaining Condition Cards
    deckBuilder.addRemainingConditionCards(conditionTotal);

    return deckBuilder.build();
  };

  //TODO: generate build single cards deck for testing
  const generateSingleDeck = (Sala: Salas, numeroTurnos: number): Deck => {
    const deckBuilder = new DeckBuilder();
    const totalPlayers = 1;
    const totalCardsPerDeck = 1;

    // 1. Generate Action Deck
    const actionTotal = totalCardsPerDeck;
    const actionTrocaCount = Math.floor(actionTotal * 0.75);
    const actionRevelarCount = actionTotal - actionTrocaCount;

    deckBuilder
      .addCard(DictCartaType.actions.troca, actionTrocaCount)
      .addCard(DictCartaType.actions.revelar, actionRevelarCount);

    // 2. Generate Object Deck
    const objectTotal = totalCardsPerDeck;
    const objectPresenteCount = Math.floor(objectTotal * 0.6);
    const objectAssentoCount = objectTotal - objectPresenteCount;

    deckBuilder
      .addCard(DictCartaType.objects.presente, objectPresenteCount)
      .addCard(DictCartaType.objects.assento, objectAssentoCount);

    // 3. Generate Condition Deck
    const conditionTotal = totalCardsPerDeck;

    // 3.1. Add Player-Specific Condition Cards
    deckBuilder.addPlayerConditionCards(Sala, totalPlayers);

    // 3.2. Add General Specific Condition Cards
    deckBuilder.addGeneralSpecificCards(conditionTotal);

    // 3.3. Add Remaining Condition Cards
    deckBuilder.addRemainingConditionCards(conditionTotal);

    return deckBuilder.build();
  }
  return { generateDeck, generateSingleDeck };
};
export { DictCartaType };

