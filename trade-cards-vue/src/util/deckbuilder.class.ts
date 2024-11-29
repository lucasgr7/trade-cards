import { CardTypeV2, CartasType, Deck, Rarity } from "../type";

export abstract class AbstractDeck {
  cards = Array<CartasType>();
  name = '';
  percentualBasic = 40;
  percentualCommon = 40;
  percentualRare = 15;
  percentualEpic = 5;
  constructor(name: string) {
    this.name = name;
  }
  setPercentualBasic(percentual: number) {
    this.percentualBasic = percentual;
  }
  setPercentualCommon(percentual: number) {
    this.percentualCommon = percentual;
  }
  setPercentualRare(percentual: number) {
    this.percentualRare = percentual;
  }
  setPercentualEpic(percentual: number) {
    this.percentualEpic = percentual;
  }
  validate(): boolean {
    // the sum of all percentual  should be 1
    return this.percentualBasic + this.percentualCommon + this.percentualRare + this.percentualEpic === 100;
  }
  generateDeck(totalCards: number): CartasType[] {
    if (!this.validate()) {
      throw new Error('Percentuals are not valid expected: 100, got: '
        + (this.percentualBasic + this.percentualCommon + this.percentualRare + this.percentualEpic));
    }
    // select only the common cards from the this.cards
    const basicCards = this.cards.filter(card => card.rarity === Rarity.basic);
    const commonCards = this.cards.filter(card => card.rarity === Rarity.common);
    const rareCards = this.cards.filter(card => card.rarity === Rarity.rare);
    const epicCards = this.cards.filter(card => card.rarity === Rarity.epic);

    // randomly generate 75% of totalCards to be the common type
    const basicCount = Math.floor(totalCards * (this.percentualBasic / 100));
    const commonCount = Math.floor(totalCards * (this.percentualCommon / 100));
    const rareCount = Math.floor(totalCards * (this.percentualRare / 100));
    const epicCount = Math.floor(totalCards * (this.percentualEpic / 100));

    const deck: CartasType[] = [];
    for (let i = 0; i < basicCount; i++) {
      deck.push(basicCards[Math.floor(Math.random() * basicCards.length)]);
    }
    for (let i = 0; i < commonCount; i++) {
      deck.push(commonCards[Math.floor(Math.random() * commonCards.length)]);
    }
    for (let i = 0; i < rareCount; i++) {
      deck.push(rareCards[Math.floor(Math.random() * rareCards.length)]);
    }
    for (let i = 0; i < epicCount; i++) {
      deck.push(epicCards[Math.floor(Math.random() * epicCards.length)]);
    }

    // filter off any undefined cards
    deck.filter(card => card !== undefined);
    // shuffle the deck
    deck.sort(() => Math.random() - 0.5);

    return deck;
  }

  protected addCards(cards: CartasType[]) {
    this.cards.push(...cards);
  }
}

export class SunDeck extends AbstractDeck {
  constructor(name: string) {
    super(name);
    this.addCards([
      { nome: 'Troca', type: CardTypeV2.Action, input: 'troca', rarity: Rarity.basic, image: 'exchange.png' },
      { nome: 'Revelar', type: CardTypeV2.Action, input: 'revelar', rarity: Rarity.basic, image: 'reveal.png' },
      { nome: 'Assento', type: CardTypeV2.Object, input: 'o assento', rarity: Rarity.basic, image: 'seat.png' },
      { nome: 'Presente', type: CardTypeV2.Object, input: 'o presente', rarity: Rarity.basic },
      { nome: 'Coins', type: CardTypeV2.Object, input: 'Coins', rarity: Rarity.rare, image: 'coins.png' },
      { nome: 'Calça', type: CardTypeV2.Object, input: 'usando a calça', rarity: Rarity.rare },
      { nome: 'Camisa', type: CardTypeV2.Object, input: 'usando a camisa', rarity: Rarity.common },
      { nome: 'Biquini', type: CardTypeV2.Object, input: 'usando o Biquini', rarity: Rarity.rare },
      { nome: 'Short', type: CardTypeV2.Object, input: 'usando a Bermuda', rarity: Rarity.common },
      { nome: 'Brinco', type: CardTypeV2.Object, input: 'usando o brinco', rarity: Rarity.rare },
      { nome: 'Chinelo', type: CardTypeV2.Object, input: 'usando o brinco', rarity: Rarity.rare },
      { nome: 'Cavada', type: CardTypeV2.Object, input: 'cavada', rarity: Rarity.rare },
      { nome: 'Qualquer um que', type: CardTypeV2.Condition, input: 'qualquer um que', rarity: Rarity.epic },
      { nome: 'Qualquer mulher', type: CardTypeV2.Condition, input: 'Qualquer mulher', rarity: Rarity.epic },
      { nome: 'Qualquer homem', type: CardTypeV2.Condition, input: 'Qualquer homem', rarity: Rarity.epic }
    ]);

    const colors = ['Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Preto', 'Branco'];
    colors.forEach(color => {
      this.cards.push({ nome: color, type: CardTypeV2.Color, input: color, rarity: Rarity.common });
    });

    const connections = ['Com', 'Sem', 'Na cor', 'Usando', 'Homem', 'Mulher', 'Próximo', 'com o da Esquerda', 'A Direita', 'A Frente'];
    connections.forEach(connection => {
      this.cards.push({ nome: connection, type: CardTypeV2.Connection, input: connection, rarity: Rarity.common });
    });
  }
}

export class MoonDeck extends AbstractDeck {
  constructor(name: string) {
    super(name);
    this.addCards([
      { nome: 'Troca', type: CardTypeV2.Action, input: 'troca', rarity: Rarity.basic, image: 'exchange.png' },
      { nome: 'Revelar', type: CardTypeV2.Action, input: 'revelar', rarity: Rarity.basic, image: 'reveal.png' },
      { nome: 'Assento', type: CardTypeV2.Object, input: 'o assento', rarity: Rarity.basic, image: 'seat.png' },
      { nome: 'Presente', type: CardTypeV2.Object, input: 'o presente', rarity: Rarity.basic },
      { nome: 'Coins', type: CardTypeV2.Object, input: 'Coins', rarity: Rarity.rare, image: 'coins.png' },
      { nome: 'Calça', type: CardTypeV2.Object, input: 'usando a calça', rarity: Rarity.rare },
      { nome: 'Camisa', type: CardTypeV2.Object, input: 'usando a camisa', rarity: Rarity.common },
      { nome: 'Biquini', type: CardTypeV2.Object, input: 'usando o Biquini', rarity: Rarity.common },
      { nome: 'Short', type: CardTypeV2.Object, input: 'usando a Bermuda', rarity: Rarity.common },
      { nome: 'Qualquer Cor', type: CardTypeV2.Color, input: 'qualquer cor', rarity: Rarity.epic }
    ]);

    const months = ['Entre Jan a Abril', 'Entre Maio a Ago', 'Entre Set a Dez', 'Lado Esquerdo', 'Lado Direito'];
    months.forEach(month => {
      this.cards.push({ nome: month, type: CardTypeV2.Condition, input: month, rarity: Rarity.rare });
    });

    const colors = ['Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Preto', 'Branco', 'Laranja', 'Roxo', 'Cinza', 'Marrom', 'Bege'];
    colors.forEach(color => {
      this.cards.push({ nome: color, type: CardTypeV2.Color, input: color, rarity: Rarity.rare });
    });

    const connections = ['Com', 'Na cor', 'Usando', 'Homem', 'Mulher', 'Nasceu'];
    connections.forEach(connection => {
      this.cards.push({ nome: connection, type: CardTypeV2.Connection, input: connection, rarity: Rarity.common });
    });

    // TODO: Rework esse aqui para usar palavras de posicionamento como "entre duas mulheres", ou "entre dois homens"
    const signs = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'];
    signs.forEach(sign => {
      this.cards.push({ nome: sign, type: CardTypeV2.Object, input: sign, rarity: Rarity.epic });
    });
  }
}