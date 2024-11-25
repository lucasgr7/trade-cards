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

  test("deve gerar o deck sun contendo cartas comuns e básicas", () => {
    const deck: CartasType[] = generateDeck(DeckGameType.Sun);

    // assert 75% de cartas comuns
    const totalCartas = deck.length;
    const totalCartasComuns = deck.filter((carta) => carta.rarity === Rarity.common).length;
    const totalCartasBasicas = deck.filter((carta) => carta.rarity === Rarity.basic).length;
    // expect 45% of basic cards to be or 'Trocar' or 'Revelar'
    const totalCartasBasicasTrocar = deck.filter((carta) => carta.name === 'Trocar').length;
    const totalCartasBasicasRevelar = deck.filter((carta) => carta.name === 'Revelar').length;

    // should contain any quantity of these cards
    expect(totalCartasBasicas).toBeGreaterThan(0);
    expect(totalCartasBasicasTrocar).toBeGreaterThan(0);
    expect(totalCartasBasicasRevelar).toBeGreaterThan(0);

    // should be equal to 45% or more
    expect(totalCartasBasicasTrocar + totalCartasBasicasRevelar).toBeGreaterThanOrEqual(totalCartasBasicas * 0.45);
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
    const totalCartasBasicas = deck.filter((carta) => carta.rarity === Rarity.basic).length;
    // should contain any quantity of these cards
    expect(totalCartasBasicas).toBeGreaterThan(0);
    expect(totalCartasComuns).toBeGreaterThan(0);
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
