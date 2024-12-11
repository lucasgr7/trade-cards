export enum CardTypeV3 {
  Action = 'action',
  Object = 'object',
  Condition = 'condition',
  Subtraction = 'subtraction',
}

export interface Card {
  name: string;
  type: CardTypeV3;
  weight: number; // número de composições
  compositions?: string[];
}

// Classe Abstrata para definir a interface do builder
export abstract class AbstractDeckBuilder {
  abstract setActionCards(trocar: number, revelar: number, espiar?: number): this;
  abstract setObjectCards(quantityWith3: number, quantityWith2: number, quantityWith1: number, quantityWith0: number): this;
  abstract setConditionCards(quantityWith3: number, quantityWith2: number, quantityWith1: number): this;
  abstract buildDeck(): Card[];
}

// Implementação padrão configurável
export class ConfigurableDeckBuilder extends AbstractDeckBuilder {
  // Quantidades de cartas
  private actionTrocar: number = 0;
  private actionRevelar: number = 0;
  private actionEspiar: number = 0;

  private objectWith3: number = 0;
  private objectWith2: number = 0;
  private objectWith1: number = 0;
  private objectWith0: number = 0;

  private conditionWith3: number = 0;
  private conditionWith2: number = 0;
  private conditionWith1: number = 0;

  // OBJETCTS
  private objectNames: string[] = ["Presente", "Assento"];
  private objectCompositions: string[] = [
    "Em qualquer cor",
    "embrulhado",
    "desembrulhado",
    "Na cor verde",
    "Na cor vermelha",
    "Na cor azul",
    "Na cor amarela",
    "Na cor preta",
    "Na cor branca",
    "Na cor rosa",
    "Na cor roxa",
    "Na cor laranja",
  ];

  // Conditions
  private conditionBases: string[] = [
    "Homem",
    "Mulher",
    "Jogador"
  ];

  private conditionCompositions: string[] = [
    "à direita",
    "à esquerda",
    "à frente",
    "com nome iniciando em A/B/C/D",
    "com nome iniciando em E/F/G/H",
    "com nome iniciando em I/J/K/L",
    "com nome iniciando em M/N/O/P",
    "com Barba",
    "com Cabelo comprido",
    "com Cabelo curto",
    "Calvo",
    "usando Biquini",
    "usando Calça",
    "usando Camisa",
    "usando Vestido",
  ];


  // Métodos de configuração
  public setActionCards(trocar: number, revelar: number, espiar: number = 0): this {
    this.actionTrocar = trocar;
    this.actionRevelar = revelar;
    this.actionEspiar = espiar;
    return this;
  }

  public setObjectCards(quantityWith3: number, quantityWith2: number, quantityWith1: number, quantityWith0: number): this {
    this.objectWith3 = quantityWith3;
    this.objectWith2 = quantityWith2;
    this.objectWith1 = quantityWith1;
    this.objectWith0 = quantityWith0;
    return this;
  }

  public setConditionCards(quantityWith3: number, quantityWith2: number, quantityWith1: number): this {
    this.conditionWith3 = quantityWith3;
    this.conditionWith2 = quantityWith2;
    this.conditionWith1 = quantityWith1;
    return this;
  }

  public buildDeck(): Card[] {
    const deck: Card[] = [];

    // Ações
    for (let i = 0; i < this.actionTrocar; i++) {
      deck.push(this.createActionCard("Trocar"));
    }
    for (let i = 0; i < this.actionRevelar; i++) {
      deck.push(this.createActionCard("Revelar"));
    }
    for (let i = 0; i < this.actionEspiar; i++) {
      deck.push(this.createActionCard("Espiar"));
    }

    // Objetos
    deck.push(...this.createObjectCards(this.objectWith3, 3));
    deck.push(...this.createObjectCards(this.objectWith2, 2));
    deck.push(...this.createObjectCards(this.objectWith1, 1));
    deck.push(...this.createObjectCards(this.objectWith0, 0));

    // Condições
    deck.push(...this.createConditionCards(this.conditionWith3, 3));
    deck.push(...this.createConditionCards(this.conditionWith2, 2));
    deck.push(...this.createConditionCards(this.conditionWith1, 1));

    // Gerar cartas de subtração
    const totalCompositions = deck
      .filter(c => c.type === CardTypeV3.Object || c.type === CardTypeV3.Condition)
      .reduce((acc, card) => acc + (card.compositions?.length || 0), 0);

    for (let i = 0; i < totalCompositions; i++) {
      deck.push(this.createSubtractionCard());
    }

    return deck;
  }

  private createActionCard(name: string): Card {
    return {
      name,
      type: CardTypeV3.Action,
      weight: 0,
      compositions: []
    };
  }

  private createObjectCards(quantity: number, compCount: number): Card[] {
    const cards: Card[] = [];
    for (let i = 0; i < quantity; i++) {
      // Escolhe um objeto aleatório
      const objName = this.getRandomItem(this.objectNames);
      let chosenComps: string[] = [];
      if (compCount > 0) {
        chosenComps = this.getRandomCompositions(this.objectCompositions, compCount);
      }
      cards.push({
        name: objName,
        type: CardTypeV3.Object,
        weight: compCount,
        compositions: chosenComps
      });
    }
    return cards;
  }

  private createConditionCards(quantity: number, compCount: number): Card[] {
    const cards: Card[] = [];
    for (let i = 0; i < quantity; i++) {
      const base = this.getRandomItem(this.conditionBases);
      const chosenComps = this.getRandomCompositions(this.conditionCompositions, compCount);
      cards.push({
        name: base,
        type: CardTypeV3.Condition,
        weight: compCount,
        compositions: chosenComps
      });
    }
    return cards;
  }

  private createSubtractionCard(): Card {
    return {
      name: "Subtração",
      type: CardTypeV3.Subtraction,
      weight: 0,
      compositions: []
    };
  }

  private getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private getRandomCompositions(source: string[], count: number): string[] {
    const comps = new Set<string>();
    while (comps.size < count && comps.size < source.length) {
      comps.add(this.getRandomItem(source));
    }
    return Array.from(comps);
  }
}

// Exemplo de uso:
// Quero 10 cartas de trocar, 5 revelar, 2 espiar
// Objetos: 3 com 3 comp, 4 com 2 comp, 5 com 1 comp, 6 sem comp
// Condições: 2 com 3 comp, 2 com 2 comp, 2 com 1 comp

