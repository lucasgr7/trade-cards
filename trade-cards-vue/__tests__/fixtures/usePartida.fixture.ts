// __tests__/fixtures/usePartida.fixture.ts
import { Deck, Partidas } from "../../src/type";

export const fixturePartida: Partidas = {
  id: 1,
  sala_id: 1,
  cartas_disponiveis: {
    "troca": {
      count: 1,
      tipo: "action",
      descricao: "Troca de cartas",
    },
    "revelar": {
      count: 1,
      tipo: "action",
      descricao: "Revelar cartas",
    },
  },
  jogadores: [
    {
      seed: "default-seed",
      avatarUrl: "default-avatar-url",
      nickname: "default-nickname",
      creator: true,
      isValid: true,
    },
    {
      seed: "seed1",
      avatarUrl: "url1",
      nickname: "Jogador1",
      isValid: true,
    },
    {
      seed: "seed2",
      avatarUrl: "url2",
      nickname: "Jogador2",
      isValid: true,
    }
  ],
  rodada_atual: 1,
  acoes: [],
  estado: "iniciado",
  created_at: "2023-10-01T00:00:00Z",
  atualizado_em: "2023-10-01T00:00:00Z"
};
