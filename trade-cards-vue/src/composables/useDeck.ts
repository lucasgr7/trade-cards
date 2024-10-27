import { CartasType, Deck } from "../type";
import { Salas } from "./useSalas";

export const DictCartaType = {
  actions: {
    troca: {
      nome: 'Troca',
      descricao: 'Troca',
      tipo: 'action',
      isGenerative: false
    } as CartasType,
    revelar: {
      nome: 'Revelar',
      descricao: 'Revela',
      tipo: 'action',
      isGenerative: false
    } as CartasType
  },
  objects: {
    assento: {
      nome: 'Assento',
      descricao: 'Assento',
      tipo: 'object',
      isGenerative: false
    } as CartasType,
    presente: {
      nome: 'Presente',
      descricao: 'Presente',
      tipo: 'object',
      isGenerative: false
    } as CartasType
  },
  conditions: {
    aSuaEsquerda: {
      nome: 'A sua esquerda',
      descricao: 'A sua esquerda',
      tipo: 'condition',
      isGenerative: false
    } as CartasType,
    aSuaDireita: {
      nome: 'A sua direita',
      descricao: 'A sua direita',
      tipo: 'condition',
      isGenerative: false
    } as CartasType,
    aSuaFrente: {
      nome: 'A sua frente',
      descricao: 'A sua frente',
      tipo: 'condition',
      isGenerative: false
    } as CartasType,
    mulherMaisProxima: {
      nome: 'Mulher mais próxima',
      descricao: 'Mulher mais próxima',
      tipo: 'condition',
      isGenerative: false
    } as CartasType,
    homemMaisProximo: {
      nome: 'Homem mais próximo',
      descricao: 'Homem mais próximo',
      tipo: 'condition',
      isGenerative: false
    } as CartasType,
    jogadorEspecifico: {
      nome: 'Jogador específico',
      descricao: 'Jogador específico',
      tipo: 'condition',
      isGenerative: true
    } as CartasType,
    familiarDeJogador: {
      nome: 'Familiar de jogador',
      descricao: 'Familiar de jogador',
      tipo: 'condition',
      isGenerative: true
    } as CartasType,
    qualquerMulher: {
      nome: 'Qualquer mulher',
      descricao: 'Qualquer mulher',
      tipo: 'condition',
      isGenerative: false
    } as CartasType,
    qualquerHomem: {
      nome: 'Qualquer homem',
      descricao: 'Qualquer homem',
      tipo: 'condition',
      isGenerative: false
    } as CartasType
  }
}

export const useDeck = () => {

  // Função para embaralhar um array (Fisher-Yates)
  const shuffle = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Função para adicionar cartas ao deck baseado em quantidade
  const addCardsToDeck = (deck: Deck, card: CartasType, count: number, uniqueIdentifier?: string) => {
    let cardName = card.nome;
    let descricao = card.descricao;

    // Se a carta for única e tiver um identificador, ajusta o nome e a descrição
    if (uniqueIdentifier) {
      cardName = `${card.nome} - ${uniqueIdentifier}`;
      descricao = `${card.descricao} para ${uniqueIdentifier}`;
    }

    if (deck[cardName]) {
      deck[cardName].count += count;
    } else {
      deck[cardName] = {
        count: count,
        tipo: card.tipo,
        descricao: descricao
      };
    }
  };

  // Função para gerar cartas específicas para cada jogador
  const generatePlayerConditionCards = (deck: Deck, Sala: Salas, totalPlayers: number) => {
    const playerSpecificAvailable = [
      DictCartaType.conditions.jogadorEspecifico,
      DictCartaType.conditions.familiarDeJogador
    ];

    Sala.jogadores.forEach(jogador => {
      const playerSpecificCount = Math.floor(totalPlayers * 0.2);
      const selectedPlayerSpecific = shuffle(playerSpecificAvailable).slice(0, playerSpecificCount);

      selectedPlayerSpecific.forEach(card => {
        // Utiliza o nickname do jogador como identificador único
        const uniqueIdentifier = jogador.nickname;
        addCardsToDeck(deck, card, 1, uniqueIdentifier);
      });
    });
  };

  // Função para gerar cartas gerais com menor percentual
  const generateGeneralSpecificCards = (deck: Deck, availableCards: CartasType[], total: number) => {
    // Supondo que essas cartas têm uma baixa frequência, por exemplo, 10%
    const percentage = 0.1;
    const count = Math.floor(total * percentage);
    const selectedCards = shuffle(availableCards).slice(0, count);
    selectedCards.forEach(card => addCardsToDeck(deck, card, 1));
  };

  function generateDeck(Sala: Salas, numeroTurnos: number): Deck {
    const deck: Deck = {};
    const totalPlayers = Sala.jogadores.length;
    const totalCardsPerDeck = numeroTurnos * totalPlayers;

    // 1. Gerar Action Deck
    const actionTotal = totalCardsPerDeck;
    const actionTrocaCount = Math.floor(actionTotal * 0.75);
    const actionRevelarCount = actionTotal - actionTrocaCount;

    addCardsToDeck(deck, DictCartaType.actions.troca, actionTrocaCount);
    addCardsToDeck(deck, DictCartaType.actions.revelar, actionRevelarCount);

    // 2. Gerar Object Deck
    const objectTotal = totalCardsPerDeck;
    const objectPresenteCount = Math.floor(objectTotal * 0.6);
    const objectAssentoCount = objectTotal - objectPresenteCount;

    addCardsToDeck(deck, DictCartaType.objects.presente, objectPresenteCount);
    addCardsToDeck(deck, DictCartaType.objects.assento, objectAssentoCount);

    // 3. Gerar Condition Deck
    const conditionTotal = totalCardsPerDeck;

    // 3.1. Cartas condicionais de jogador específico
    generatePlayerConditionCards(deck, Sala, totalPlayers);

    // 3.2. Cartas condicionais gerais com menor percentual
    const generalSpecificAvailable = [
      DictCartaType.conditions.qualquerMulher,
      DictCartaType.conditions.qualquerHomem
    ];
    generateGeneralSpecificCards(deck, generalSpecificAvailable, conditionTotal);

    // 3.3. Cartas restantes (não gerativas e não específicas)
    const conditionCardsAdded = Object.values(deck).reduce((count, card) => {
      if (card.tipo === 'condition') {
      return count + card.count;
      }
      return count;
    }, 0);

    // Calculate the remaining condition cards to be added
    let remainingCount = conditionTotal - conditionCardsAdded;

    const nonGenerativeNonSpecificAvailable = [
      DictCartaType.conditions.aSuaEsquerda,
      DictCartaType.conditions.aSuaDireita,
      DictCartaType.conditions.aSuaFrente,
      DictCartaType.conditions.mulherMaisProxima,
      DictCartaType.conditions.homemMaisProximo
    ];

    while (remainingCount > 0) {
      const shuffledRemaining = shuffle(nonGenerativeNonSpecificAvailable);
      shuffledRemaining.forEach(card => {
      if (remainingCount > 0) {
        addCardsToDeck(deck, card, 1);
        remainingCount--;
      }
      });
    }

    return deck;
  }

  return { generateDeck };
};