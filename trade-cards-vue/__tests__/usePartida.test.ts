// __tests__/usePartida.test.ts
import { computed, nextTick, ref } from "vue";
import { expect, describe, it } from "@jest/globals";
import { usePlayer } from '../src/composables/usePlayer';
import { Exceptions } from './../src/util/enum.exceptions';
import { fixturePartida } from "./fixtures/usePartida.fixture";
// Mock para supabase

jest.mock('../src/util/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: fixturePartida, error: null }),
  }
}
));

// Mock para useSupaTable
jest.mock('../src/util/useSupaTable', () => ({
  useSupaTable: jest.fn(() => ({
    records: [],
    error: null,
    insertRecord: jest.fn(),
    getRecords: jest.fn(),
    updateRecord: jest.fn(),
    deleteRecord: jest.fn(),
    getRecordById: jest.fn(),
    search: jest.fn(),
    createId: jest.fn(),
    single: jest.fn().mockResolvedValue({
      data: fixturePartida,
      error: null,
    }),
  }))
}));


let supabaseMock: any;
  
// Mock para supabase
jest.mock('../src/util/supabase', () => {
  supabaseMock = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    channel: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn(),
  };
  return { supabase: supabaseMock };
});;
describe("usePartida", () => {
  let initialize: any;
  let partida: any;
  let usePlayerMock: jest.Mock

  beforeEach(() => {
    jest.resetModules();

    // Mock de usePlayer
    jest.mock('../src/composables/usePlayer', () => ({
      usePlayer: jest.fn(() => ({
        getMyself: computed(() => ({
          seed: 'default-seed',
          avatarUrl: 'default-avatar-url',
          nickname: 'default-nickname',
          creator: true,
          isValid: true,
        })),
        saveUserData: jest.fn(() => true),
        deleteUserData: jest.fn(),
      })),
    }));

    // Importar usePlayer e usePartidas após configurar o mock
    const usePlayerModule = require('../src/composables/usePlayer');
    usePlayerMock = usePlayerModule.usePlayer;
  
    const usePartidasModule = require('../src/composables/usePartidas');
    ({ initialize, partida } = usePartidasModule.usePartidas());
  });

  it("Deve garantir que usePlayer esta mockado", () => {
    expect(usePlayerMock).toBeDefined();
  });
  it("Deve dar erro se não passar o Id da sala", async () => {
    await expect(initialize(null)).rejects.toThrow(Exceptions.MATCH_INVALID_ID);
  });

  it("Deve dar erro se o ID for zero", async () => {
    await expect(initialize(0)).rejects.toThrow(Exceptions.MATCH_INVALID_ID);
  });

  it("O erro deve ser traduzido para string do valor da exception", async () => {
    await expect(initialize(0)).rejects.toThrow(Exceptions.MATCH_INVALID_ID);
  });


  it("O usuário deve fazer o request da API", async () => {
    // Configurar o mock para retornar fixturePartida
    supabaseMock.single.mockResolvedValueOnce({ data: fixturePartida, error: null });
    await initialize(1);
    await nextTick();
    expect(partida.value).toEqual(fixturePartida);
  });


  it("Caso o usuário não possua um ID, deve retornar um erro", async () => {
    usePlayerMock.mockImplementation(() => ({
      getMyself: computed(() => ({
        isValid: false,
      })),
      saveUserData: jest.fn(),
      deleteUserData: jest.fn(),
    }));

    // Reimportar usePartidas após alterar o mock
    const usePartidasModule = require('../src/composables/usePartidas');
    ({ initialize } = usePartidasModule.usePartidas());

    await expect(initialize(1)).rejects.toThrow(Exceptions.USER_SESSION_NOT_FOUND);
  });

  it("Espera que a partida possua o estado de Iniciada", async () => {})

  it("Caso o usuário entre em uma partida com estado não iniciado redirecione para wait-room", async () => {})
  it("Espero que a partida possua um Deck", async () => {})
  it("Deverá emitir evento de utilização de uma carta", async () => {})
  it("Espero que recebe evento de atualização da partida", async () => {})
  it("Deverá ter um signal de esconder a carta que estou vendo", async () => {})

});
