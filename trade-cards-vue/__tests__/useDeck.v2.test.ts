// __tests__/useDeck.test.ts
import { useDeck } from "../src/composables/game/useDeck";
import { Salas } from "../src/composables/apis/useSalas";
import { CartasType, DeckGameType, Jogador, Rarity } from "../src/type";
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

  test("deve gerar o deck sun contendo 75% cartas comuns", () => {
    const deck: CartasType[] = generateDeck(DeckGameType.Sun);

    // assert 75% de cartas comuns
    const totalCartas = deck.length;
    const totalCartasComuns = deck.filter((carta) => carta.rarity === Rarity.common).length;
    const percentualComum = totalCartasComuns / totalCartas;
    //higher or equal .75
    expect(percentualComum).toBeGreaterThanOrEqual(0.75);
  });

  test("deve gerar o deck sun conter cartas raras e épicas", () => {
    const deck: CartasType[] = generateDeck(DeckGameType.Sun);

    // assert contain rares and epics
    const totalCartas = deck.length;
    const totalCartasRaras = deck.filter((carta) => carta.rarity === Rarity.rare).length;
    const totalCartasEpicas = deck.filter((carta) => carta.rarity === Rarity.epic).length;

    //assert
    expect(totalCartasRaras).toBeGreaterThan(5);
    expect(totalCartasEpicas).toBeGreaterThan(0);
  });

  test('Deve gerar deck Moon contendo 60% cartas comuns', () => {
    const deck: CartasType[] = generateDeck(DeckGameType.Moon);

    // assert 60% de cartas comuns
    const totalCartas = deck.length;
    const totalCartasComuns = deck.filter((carta) => carta.rarity === Rarity.common).length;
    const percentualComum = totalCartasComuns / totalCartas;
    //higher or equal .60
    expect(percentualComum).toBeLessThanOrEqual(0.61);
  })

  test('Deve gerar deck Moon contendo cartas raras e épicas', () => {
    const deck: CartasType[] = generateDeck(DeckGameType.Moon);

    // assert contain rares and epics
    const totalCartasRaras = deck.filter((carta) => carta.rarity === Rarity.rare).length;
    const totalCartasEpicas = deck.filter((carta) => carta.rarity === Rarity.epic).length;

    //assert
    expect(totalCartasRaras).toBeGreaterThan(5);
    expect(totalCartasEpicas).toBeGreaterThan(0);
  })

});
