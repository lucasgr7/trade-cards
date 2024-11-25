import { CardTypeV2, CartasType, Deck, Rarity } from "../type";
import { Salas } from "../composables/apis/useSalas";


export abstract class AbstractDeck {
  cards = Array<CartasType>();
  name = '';
  percentualCommon = 0.75;
  percentualRare = 0.2;
  percentualEpic = 0.05;
  constructor(name: string) {
    this.name = name;
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
  generateDeck(totalCards: number): CartasType[] {
    // select only the common cards from the this.cards
    const commonCards = this.cards.filter(card => card.rarity === Rarity.common);
    const rareCards = this.cards.filter(card => card.rarity === Rarity.rare);
    const epicCards = this.cards.filter(card => card.rarity === Rarity.epic);

    // randomly generate 75% of totalCards to be the common type
    const commonCount = Math.floor(totalCards * this.percentualCommon);
    const rareCount = Math.floor(totalCards * this.percentualRare);
    const epicCount = Math.floor(totalCards * this.percentualEpic);

    const deck = [];
    for (let i = 0; i < commonCount; i++) {
      deck.push(commonCards[Math.floor(Math.random() * commonCards.length)]);
    }
    for (let i = 0; i < rareCount; i++) {
      deck.push(rareCards[Math.floor(Math.random() * rareCards.length)]);
    }
    for (let i = 0; i < epicCount; i++) {
      deck.push(epicCards[Math.floor(Math.random() * epicCards.length)]);
    }
    return deck;
  }
}

export class SunDeck extends AbstractDeck {
  constructor(name: string){
    super(name);
    this.cards.push({ nome: 'Troca', type: CardTypeV2.Action, input: 'troca', rarity: Rarity.common });
    this.cards.push({ nome: 'Revelar', type: CardTypeV2.Action, input: 'revelar', rarity: Rarity.common });

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
    this.cards.push({ nome: 'Troca', type: CardTypeV2.Action, input: 'troca', rarity: Rarity.common });
    this.cards.push({ nome: 'Revelar', type: CardTypeV2.Action, input: 'revelar', rarity: Rarity.common });

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
      this.cards.push({ nome: month, type: CardTypeV2.Object, input: month, rarity: Rarity.rare });
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