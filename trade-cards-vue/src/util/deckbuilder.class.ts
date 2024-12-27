import { TradingCard, CardTypeV3 } from "@/type";
import { CardAssentoBuilder, CardPresenteBuilder, CardRevelearBuilder, CardTrocarBuilder } from "./cardbuilder.class";

// Removed duplicate CardTypeV3 enum


// Classe Abstrata para definir a interface do builder
export abstract class AbstractDeckBuilder {
  private rounds: number = 0;
  private deck: TradingCard[] = [];

  withNumberOfRounds(arg0: number) {
    this.rounds = arg0;
    return this;
  }

  // Helper function to create cards with a specified number of compositions
  createCards(rounds: number, compositions: number) {
    for (let i = 0; i < rounds; i++) {
      const presentCardBuilder = new CardPresenteBuilder();
      const seatCardBuilder = new CardAssentoBuilder();

      for (let j = 0; j < compositions; j++) {
        presentCardBuilder.addRandomComposition();
        seatCardBuilder.addRandomComposition();
      }

      this.deck.push(presentCardBuilder.build());
      this.deck.push(seatCardBuilder.build());
      this.deck.push(...presentCardBuilder.buildNegCards())
      this.deck.push(...seatCardBuilder.buildNegCards())
    }
  }


  build(): TradingCard[] {

    // 3/4 of the rounds should be 'Troca' cards
    for (let i = 0; i < Math.round(this.rounds * 0.75); i++) {
      this.deck.push(new CardTrocarBuilder().build());

    }
    // 1/4 of the rounds should be 'Revelar' cards
    for (let i = 0; i < Math.round(this.rounds * 0.25); i++) {
      this.deck.push(new CardRevelearBuilder().build());
    }

    // 50% of rounds should be 'Presente' with 3 compositions
    this.createCards(Math.round(this.rounds * 0.35), 4);
    // 50% of rounds should be 'Presente' with 3 compositions
    this.createCards(Math.round(this.rounds * 0.35), 3);

    // 30% of rounds should be 'Presente' with 2 compositions
    this.createCards(Math.round(this.rounds * 0.3), 2);

    // 5% of rounds should be 'Presente' with 1 composition
    this.createCards(Math.round(this.rounds * 0.05), 1);

    // eliminate 25% of negative cards from deck
    this.deck = this.deck.filter((card) => card.type !== CardTypeV3.Subtraction || Math.random() > 0.25);
    
    return this.deck;
  }
}

// Implementação padrão configurável
export class DeckBuilder extends AbstractDeckBuilder {

}
