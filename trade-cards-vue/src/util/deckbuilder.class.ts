import { CartasType, Deck } from "../type";
import { Salas } from "../composables/apis/useSalas";

// Existing DictCartaType remains unchanged
export const DictCartaType = {
  actions: {
    troca: {
      nome: 'Troca',
      descricao: 'Troca',
      tipo: 'action',
      isGenerative: false
    } as unknown as unknown as CartasType,
    revelar: {
      nome: 'Revelar',
      descricao: 'Revela',
      tipo: 'action',
      isGenerative: false
    } as unknown as CartasType
  },
  objects: {
    assento: {
      nome: 'Assento',
      descricao: 'Assento',
      tipo: 'object',
      isGenerative: false
    } as unknown as CartasType,
    presente: {
      nome: 'Presente',
      descricao: 'Presente',
      tipo: 'object',
      isGenerative: false
    } as unknown as CartasType
  },
  conditions: {
    aSuaEsquerda: {
      nome: 'A sua esquerda',
      descricao: 'A sua esquerda',
      tipo: 'condition',
      isGenerative: false
    } as unknown as CartasType,
    aSuaDireita: {
      nome: 'A sua direita',
      descricao: 'A sua direita',
      tipo: 'condition',
      isGenerative: false
    } as unknown as CartasType,
    aSuaFrente: {
      nome: 'A sua frente',
      descricao: 'A sua frente',
      tipo: 'condition',
      isGenerative: false
    } as unknown as CartasType,
    mulherMaisProxima: {
      nome: 'Mulher mais próxima',
      descricao: 'Mulher mais próxima',
      tipo: 'condition',
      isGenerative: false
    } as unknown as CartasType,
    homemMaisProximo: {
      nome: 'Homem mais próximo',
      descricao: 'Homem mais próximo',
      tipo: 'condition',
      isGenerative: false
    } as unknown as CartasType,
    jogadorEspecifico: {
      nome: 'Jogador específico',
      descricao: 'Jogador específico',
      tipo: 'condition',
      isGenerative: true
    } as unknown as CartasType,
    familiarDeJogador: {
      nome: 'Familiar de jogador',
      descricao: 'Familiar de jogador',
      tipo: 'condition',
      isGenerative: true
    } as unknown as CartasType,
    qualquerMulher: {
      nome: 'Qualquer mulher',
      descricao: 'Qualquer mulher',
      tipo: 'condition',
      isGenerative: false
    } as unknown as CartasType,
    qualquerHomem: {
      nome: 'Qualquer homem',
      descricao: 'Qualquer homem',
      tipo: 'condition',
      isGenerative: false
    } as unknown as CartasType
  }
};

export class DeckBuilder {
  private deck: Deck = {};

  // Fisher-Yates shuffle algorithm
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Adds a card to the deck with optional unique identifier
  public addCard(card: CartasType, count: number = 1, uniqueIdentifier?: string): DeckBuilder {
    let cardName = card.nome;
    let descricao = card.descricao;

    if (uniqueIdentifier) {
      cardName = `${card.nome} - ${uniqueIdentifier}`;
      descricao = `${card.descricao} para ${uniqueIdentifier}`;
    }

    if (this.deck[cardName]) {
      this.deck[cardName].count += count;
    } else {
      this.deck[cardName] = {
        count: count,
        tipo: card.tipo,
        descricao: descricao
      };
    }

    return this;
  }

  // Adds multiple cards based on a proportion
  public addCardsByProportion(card: CartasType, total: number, proportion: number, uniqueIdentifier?: string): DeckBuilder {
    const count = Math.floor(total * proportion);
    return this.addCard(card, count, uniqueIdentifier);
  }

  // Generates player-specific condition cards
  public addPlayerConditionCards(Sala: Salas, totalPlayers: number): DeckBuilder {
    const playerSpecificAvailable = [
      DictCartaType.conditions.jogadorEspecifico,
      DictCartaType.conditions.familiarDeJogador
    ];

    Sala.jogadores.forEach(jogador => {
      const playerSpecificCount = Math.floor(totalPlayers * 0.2);
      const selectedPlayerSpecific = this.shuffle(playerSpecificAvailable).slice(0, playerSpecificCount);

      selectedPlayerSpecific.forEach(card => {
        this.addCard(card, 1, jogador.nickname);
      });
    });

    return this;
  }

  // Generates general specific condition cards
  public addGeneralSpecificCards(total: number): DeckBuilder {
    const generalSpecificAvailable = [
      DictCartaType.conditions.qualquerMulher,
      DictCartaType.conditions.qualquerHomem
    ];
    const percentage = 0.1;
    const count = Math.floor(total * percentage);
    const selectedCards = this.shuffle(generalSpecificAvailable).slice(0, count);
    selectedCards.forEach(card => this.addCard(card, 1));
    return this;
  }

  // Generates non-generative and non-specific condition cards to fill the remaining count
  public addRemainingConditionCards(total: number): DeckBuilder {
    const conditionCardsAdded = Object.values(this.deck).reduce((count, card) => {
      if (card.tipo === 'condition') {
        return count + card.count;
      }
      return count;
    }, 0);

    let remainingCount = total - conditionCardsAdded;

    const nonGenerativeNonSpecificAvailable = [
      DictCartaType.conditions.aSuaEsquerda,
      DictCartaType.conditions.aSuaDireita,
      DictCartaType.conditions.aSuaFrente,
      DictCartaType.conditions.mulherMaisProxima,
      DictCartaType.conditions.homemMaisProximo
    ];

    while (remainingCount > 0) {
      const shuffledRemaining = this.shuffle(nonGenerativeNonSpecificAvailable);
      for (const card of shuffledRemaining) {
        if (remainingCount > 0) {
          this.addCard(card, 1);
          remainingCount--;
        } else {
          break;
        }
      }
    }

    return this;
  }

  // Builds the final deck
  public build(): Deck {
    return this.deck;
  }
}
