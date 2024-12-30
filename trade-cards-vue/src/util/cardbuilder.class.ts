import { TradingCard, CardTypeV3, Composition } from "@/type";
import { CardCompositionEnum, CardNameEnum } from "@/enums/cardType";


class CardBuilder {
  compositions?: Composition;
  card: TradingCard = {
    description: '',
    title: '',
    type: CardTypeV3.Action,
    weight: 0,
    image: '',
  };
  usedCompositions: string[] = [];
  negCards: TradingCard[] = [];

  constructor(type: CardTypeV3,
    compositions?: Composition) {
    this.card.type = type;
    this.compositions = compositions;
  }


  addComposition(composition: CardCompositionEnum): this {
    this.card.weight += 1;

    // check if CardCompositionEnum is valid
    if (!this.compositions || !(composition in this.compositions)) {
      throw new Error(`Invalid composition: ${composition}`);
    }

    // select a random value from the composition
    const selectedComposition = this.compositions![composition][Math.floor(Math.random() * this.compositions![composition].length)];

    // add the selected value to the Card object
    if (!this.card.compositions) {
      this.card.compositions = {};
    }

    // Check if the card type is Seat and the composition is ColorVariant
    if (this.card.type === CardTypeV3.Seat && composition === CardCompositionEnum.ColorVariant) {
      // Ensure ClothingType exists before adding ColorVariant
      if (this.card.compositions[CardCompositionEnum.ClothingType]) {
        this.card.compositions[composition] = [selectedComposition];
      } else {
        // Try another variation if ClothingType does not exist
        return this.addRandomComposition();
      }
    } else {
      this.card.compositions[composition] = [selectedComposition];
    }

    this.usedCompositions.push(composition);

    this.negCards.push(
      new CardBuilder(CardTypeV3.Subtraction)
      .withTitle('Negativa')
      .withDescription(selectedComposition).withImage('negative.png')
      .build()
    )

    return this;
  }

  addRandomComposition() {
    // randomly select a composition, garantee is not repeated using the property usedCompositions
    const composition = Object.keys(this.compositions!)
      .filter((composition) => !this.usedCompositions.includes(composition));

    const selectedComposition = composition[Math.floor(Math.random() * composition.length)] as CardCompositionEnum;

    if (!composition) {
      throw new Error('No composition available');
    }

    this.addComposition(selectedComposition as CardCompositionEnum);
    return this;
  }
  withTitle(title: string): this {
    this.card.title = title;
    return this;
  }

  withDescription(description: string): this {
    this.card.description = description;
    return this;
  }

  withImage(image: string): this {
    this.card.image = image;
    return this;
  }

  build(): TradingCard {
    return this.card;
  }

  buildNegCards(): TradingCard[] {
    return this.negCards;
  }
}

export class CardPresenteBuilder extends CardBuilder {
  public myCompositions = [
    CardCompositionEnum.ColorVariant, CardCompositionEnum.WrappedState
  ];
  constructor() {
    super(CardTypeV3.Gift,
      {
        [CardCompositionEnum.WrappedState]: ['Embrulhado', 'Desembrulhado'],
        [CardCompositionEnum.ColorVariant]: ['verde', 'vermelho', 'azul', 'amarelo', 'preto', 'branco', 'rosa', 'roxo', 'laranja'],
        [CardCompositionEnum.Player]: ['de um Homem', 'de uma Mulher'],
        [CardCompositionEnum.ClothingType]: ['usando Camisa', 'usando Calça', 'usando Vestido', 'usando Bermuda', 'tem barba', 'com cabelo curto', 'com cabelo longo'],
        [CardCompositionEnum.Positioning]: ['A minha frente', 'A minha direita', 'A minha esquerda', 'entre duas mulheres', 'entre dois homens'],
      }
    );
    this.withTitle(CardNameEnum.Presente).withImage('gift.png').withDescription('Presente');
  }
}

export class CardAssentoBuilder extends CardBuilder {
  constructor() {
    super(CardTypeV3.Seat,
      {
        [CardCompositionEnum.Positioning]: ['A minha frente', 'A minha direita', 'A minha esquerda', 'entre duas mulheres', 'entre dois homens'],
        [CardCompositionEnum.Player]: ['de um Homem', 'de uma Mulher'],
        [CardCompositionEnum.ClothingType]: ['usando Camisa', 'usando Calça', 'usando Vestido', 'usando Bermuda'],
        [CardCompositionEnum.ColorVariant]: ['verde', 'vermelho', 'azul', 'amarelo', 'preto', 'branco', 'rosa', 'roxo', 'laranja'],
      });
    this.withTitle(CardNameEnum.Assento).withImage('seat.png').withDescription('Assento');
  }
}

export class CardTrocarBuilder extends CardBuilder {
  constructor() {
    super(CardTypeV3.Action);
    this.withTitle(CardNameEnum.Troca)
    .withImage('exchange.png')
    .withDescription('Troque');
  }
}

export class CardRevelearBuilder extends CardBuilder {
  constructor() {
    super(CardTypeV3.Action);
    this.withTitle(CardNameEnum.Revelar)
    .withImage('reveal.png')
    .withDescription('Revelar');
  }
}

