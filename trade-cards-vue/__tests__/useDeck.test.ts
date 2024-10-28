// __tests__/useDeck.test.ts
import { useDeck } from "../src/composables/useDeck";
import { Salas } from "../src/composables/useSalas";
import { DictCartaType  } from "../src/composables/useDeck";
import { Deck, Jogador } from "../src/type";
import { describe, expect, test } from "vitest";

describe("useDeck - Função generateDeck", () => {
  const { generateDeck } = useDeck();

  // Função auxiliar para criar uma sala com um número específico de jogadores
  const criarSala = (numJogadores: number): Salas => {
    const jogadores: Jogador[] = [];
    for (let i = 0; i < numJogadores; i++) {
      jogadores.push({
        seed: `seed${i + 1}`,
        avatarUrl: `url${i + 1}`,
        nickname: `Jogador${i + 1}`,
      });
    }
    return {
      name: "Sala Teste",
      jogadores,
      estado: 1,
    };
  };

  test("deve gerar o deck com a quantidade correta de cartas de ação", () => {
    const sala = criarSala(9);
    const numeroTurnos = 9;
    const deck: Deck = generateDeck(sala, numeroTurnos);

    const totalCardsPerDeck = numeroTurnos * sala.jogadores.length;
    // sum total cards
    let countSizeDeck = 0;
    let countSizeActionDeck = 0;
    let countSizeObjectDeck = 0;
    let countSizeConditionDeck = 0;

    for(let deckCardIndex in Object.values(deck)){
      const deckCard = Object.values(deck)[deckCardIndex];
      if (deckCard.tipo === "action") {
        countSizeActionDeck += deckCard.count;
      }
      else if (deckCard.tipo === "object") {
        countSizeObjectDeck += deckCard.count;
      }
      else if (deckCard.tipo === "condition") {
        countSizeConditionDeck += deckCard.count;
      }
      countSizeDeck += deckCard.count;
    }


    const expectedTroca = Math.floor(totalCardsPerDeck * 0.75);
    const expectedRevelar = totalCardsPerDeck - expectedTroca;

    expect(deck[DictCartaType.actions.troca.nome].count).toBe(expectedTroca);
    expect(deck[DictCartaType.actions.revelar.nome].count).toBe(expectedRevelar);
    expect(countSizeActionDeck).toBe(totalCardsPerDeck);
    expect(countSizeObjectDeck).toBe(totalCardsPerDeck);
    expect(countSizeConditionDeck).toBe(totalCardsPerDeck);
    expect(countSizeDeck).toBe(totalCardsPerDeck * 3);
  });

  test("deve gerar o deck com a quantidade correta de cartas de objeto", () => {
    const sala = criarSala(4);
    const numeroTurnos = 3;
    const deck: Deck = generateDeck(sala, numeroTurnos);

    const totalCardsPerDeck = numeroTurnos * sala.jogadores.length;

    const expectedPresente = Math.floor(totalCardsPerDeck * 0.6);
    const expectedAssento = totalCardsPerDeck - expectedPresente;

    expect(deck[DictCartaType.objects.presente.nome].count).toBe(expectedPresente);
    expect(deck[DictCartaType.objects.assento.nome].count).toBe(expectedAssento);
  });

  test("deve gerar quantidade correta de cartas condição", () => {
    const sala = criarSala(5);
    const numeroTurnos = 4;
    const deck: Deck = generateDeck(sala, numeroTurnos);

    const totalCardsPerDeck = numeroTurnos * sala.jogadores.length;
    
    // agroup todas as cartas de condiçã odo deck
    let count = 0;
    for(let deckCardIndex in Object.values(deck)){
      const deckCard = Object.values(deck)[deckCardIndex];
      if (deckCard.tipo === "condition") {
        count += deckCard.count;
      }
    }
    expect(count).toBe(totalCardsPerDeck);
  })

  test("deve gerar corretamente com um único jogador", () => {
    const sala = criarSala(1);
    const numeroTurnos = 2;
    const deck: Deck = generateDeck(sala, numeroTurnos);

    const totalCardsPerDeck = numeroTurnos * sala.jogadores.length;

    const expectedTroca = Math.floor(totalCardsPerDeck * 0.75);
    const expectedRevelar = totalCardsPerDeck - expectedTroca;

    expect(deck[DictCartaType.actions.troca.nome].count).toBe(expectedTroca);
    expect(deck[DictCartaType.actions.revelar.nome].count).toBe(expectedRevelar);
  })

});
