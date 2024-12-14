

import { describe, it, expect } from 'vitest';
import { DeckBuilder } from '../src/util/deckbuilder.class';
import { CardNameEnum } from '../src/enums/cardType';
import { TradingCard, CardTypeV3 } from '../src/type';

describe('DeckBuilder', () => {
  it('should return an collection of cards at least one element', () => {
    const deckBuilder = new DeckBuilder();
    const deck = deckBuilder.withNumberOfRounds(9).build();
    expect(deck.length).toBeGreaterThan(0);
  })

  it('should return with a deck where 3/4 of the cards are "troca" and 1/4 are "revelar"', () => {
    const deckBuilder = new DeckBuilder();
    const deck = deckBuilder.withNumberOfRounds(4).build();
    const trocaCards = deck.filter(card => card.name === CardNameEnum.Troca);
    const revelarCards = deck.filter(card => card.name === CardNameEnum.Revelar);
    expect(trocaCards.length).equal(3);
    expect(revelarCards.length).equal(1);
  });

  it('Should return a deck with at least a card of Presente', () => {
    const deckBuilder = new DeckBuilder();
    const deck = deckBuilder.withNumberOfRounds(4).build();
    const presenteCards = deck.filter(card => card.name === CardNameEnum.Presente);
    expect(presenteCards.length).toBeGreaterThan(0);
  })

  it('Should retur na deck with a card of Presente with compositions and weight', () => {
    const deckBuilder = new DeckBuilder();
    const deck = deckBuilder.withNumberOfRounds(4).build();
    const presenteCard = deck.find(card => card.name === CardNameEnum.Presente);
    expect(presenteCard).toHaveProperty('compositions');
    expect(presenteCard).toHaveProperty('weight');
    // expect weight to be 1
    expect(presenteCard!.weight).toBeGreaterThan(1);
  });

  it('Should return a deck with 50% of cards with 3 compositions', () => {
    const deckBuilder = new DeckBuilder();
    const deck = deckBuilder.withNumberOfRounds(10).build();
    const cardsWithCompositions = deck.filter(card => card.compositions);
    expect(cardsWithCompositions.length).toBeGreaterThan(0);
    console.log(deck);
    const cardPresenteWith3Compo = cardsWithCompositions.filter((card: TradingCard) =>
      card.name === CardNameEnum.Presente &&
      Object.keys(card.compositions!).length === 3);
    expect(cardPresenteWith3Compo.length).toBe(5);
  })

  it('Should return na deck with at least a card "Assento"', () => {
    const deckBuilder = new DeckBuilder();
    const deck = deckBuilder.withNumberOfRounds(4).build();
    const assentoCards = deck.filter(card => card.name === CardNameEnum.Assento);
    expect(assentoCards.length).toBeGreaterThan(0);
  })

  it('Should contain sub-cards cards for the compositions', () => {
    const deckbuilder = new DeckBuilder();
    const deck = deckbuilder.withNumberOfRounds(4).build();
    const negCards = deck.filter((card: TradingCard) => card.type === CardTypeV3.Subtraction);

    expect(negCards.length).toBeGreaterThan(0);
  })
})