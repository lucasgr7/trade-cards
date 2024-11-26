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
  setPercentualBasic(percentual: number){
    this.percentualBasic = percentual;
  }
  setPercentualCommon(percentual: number){
    this.percentualCommon = percentual;
  }
  setPercentualRare(percentual: number){
    this.percentualRare = percentual;
  }
  setPercentualEpic(percentual: number){
    this.percentualEpic = percentual;
  }
  validate(): boolean {
    // the sum of all percentual  should be 1
    return this.percentualBasic + this.percentualCommon + this.percentualRare + this.percentualEpic === 100;
  }
  generateDeck(totalCards: number): CartasType[] {
    if(!this.validate()){
      throw new Error('Percentuals are not valid expected: 100, got: ' 
        + (this.percentualBasic + this.percentualCommon + this.percentualRare + this.percentualEpic));
    }
    // select only the common cards from the this.cards
    const basicCards = this.cards.filter(card => card.rarity === Rarity.basic);
    const commonCards = this.cards.filter(card => card.rarity === Rarity.common);
    const rareCards = this.cards.filter(card => card.rarity === Rarity.rare);
    const epicCards = this.cards.filter(card => card.rarity === Rarity.epic);

    // randomly generate 75% of totalCards to be the common type
    const basicCount = Math.floor(totalCards * (this.percentualBasic/100));
    const commonCount = Math.floor(totalCards * (this.percentualCommon/100));
    const rareCount = Math.floor(totalCards * (this.percentualRare/100));
    const epicCount = Math.floor(totalCards * (this.percentualEpic/100));

    const deck: CartasType[] = [];
    for (let i = 0; i < basicCount; i++) {
      deck.push(basicCards[Math.floor(Math.random() * basicCards.length )]);
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
}

export class SunDeck extends AbstractDeck {
  constructor(name: string){
    super(name);
    this.cards.push({ nome: 'Troca', type: CardTypeV2.Action, input: 'troca', rarity: Rarity.basic });
    this.cards.push({ nome: 'Revelar', type: CardTypeV2.Action, input: 'revelar', rarity: Rarity.basic });

    // Objeto
    this.cards.push({ nome: 'Assento', type: CardTypeV2.Object, input: 'o assento', rarity: Rarity.common });
    this.cards.push({ nome: 'Presente', type: CardTypeV2.Object, input: 'o presente', rarity: Rarity.common });

    // roupas
    this.cards.push({ nome: 'Calça', type: CardTypeV2.Object, input: 'usando a calça', rarity: Rarity.rare });
    this.cards.push({ nome: 'Camisa', type: CardTypeV2.Object, input: 'usando a camisa', rarity: Rarity.rare });
    this.cards.push({ nome: 'Biquini', type: CardTypeV2.Object, input: 'usando o Biquini', rarity: Rarity.rare });
    this.cards.push({ nome: 'Short', type: CardTypeV2.Object, input: 'usando a Bermuda', rarity: Rarity.rare });
    this.cards.push({ nome: 'Brinco', type: CardTypeV2.Object, input: 'usando o brinco', rarity: Rarity.rare });
    this.cards.push({ nome: 'Chinelo', type: CardTypeV2.Object, input: 'usando o brinco', rarity: Rarity.rare });
    this.cards.push({ nome: 'Cavada', type: CardTypeV2.Object, input: 'cavada', rarity: Rarity.rare });

    // Cores
    const colors = ['Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Preto', 'Branco'];
    colors.forEach(color => {
      this.cards.push({ nome: color, type: CardTypeV2.Color, input: color, rarity: Rarity.common });
    });

    // Conexões
    const connections = ['Com', 'Sem', 'Na cor', 'Usando', 'Homem', 'Mulher', 'Próximo', 'A Esquerda', 'A Direita', 'A Frente'];
    connections.forEach(connection => {
      this.cards.push({ nome: connection, type: CardTypeV2.Conection, input: connection, rarity: Rarity.common });
    });

    // epic 'qualquer um que'
    this.cards.push({ nome: 'Qualquer um que', type: CardTypeV2.Condition, input: 'qualquer um que', rarity: Rarity.epic });
  }
}
export class MoonDeck extends AbstractDeck {
  constructor(name: string){
    super(name);
    this.cards.push({ nome: 'Troca', type: CardTypeV2.Action, input: 'troca', rarity: Rarity.basic });
    this.cards.push({ nome: 'Revelar', type: CardTypeV2.Action, input: 'revelar', rarity: Rarity.basic });

    // Objeto
    this.cards.push({ nome: 'Assento', type: CardTypeV2.Object, input: 'o assento', rarity: Rarity.common });
    this.cards.push({ nome: 'Presente', type: CardTypeV2.Object, input: 'o presente', rarity: Rarity.common });

    // roupas
    this.cards.push({ nome: 'Calça', type: CardTypeV2.Object, input: 'usando a calça', rarity: Rarity.rare });
    this.cards.push({ nome: 'Camisa', type: CardTypeV2.Object, input: 'usando a camisa', rarity: Rarity.rare });
    this.cards.push({ nome: 'Biquini', type: CardTypeV2.Object, input: 'usando o Biquini', rarity: Rarity.rare });
    this.cards.push({ nome: 'Short', type: CardTypeV2.Object, input: 'usando a Bermuda', rarity: Rarity.rare });

    // meses nascimento
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']; 
    months.forEach(month => {
      this.cards.push({ nome: month, type: CardTypeV2.Condition, input: month, rarity: Rarity.rare });
    });

    // Cores 12
    const colors = ['Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Preto', 'Branco', 'Laranja', 'Roxo', 'Cinza', 'Marrom', 'Bege'];
    colors.forEach(color => {
      this.cards.push({ nome: color, type: CardTypeV2.Color, input: color, rarity: Rarity.rare });
    });

    // epic color "qualquer cor"
    this.cards.push({ nome: 'Qualquer Cor', type: CardTypeV2.Color, input: 'qualquer cor', rarity: Rarity.epic });

    // Conexões
    const connections = ['Com', 'Sem', 'Na cor', 'Usando', 'Homem', 'Mulher'];
    connections.forEach(connection => {
      this.cards.push({ nome: connection, type: CardTypeV2.Conection, input: connection, rarity: Rarity.common });
    });

    // signos
    const signs = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'];
    signs.forEach(sign => {
      this.cards.push({ nome: sign, type: CardTypeV2.Object, input: sign, rarity: Rarity.epic });
    });
  }
}