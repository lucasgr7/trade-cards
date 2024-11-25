import { fixturePartida } from './fixtures/usePartida.fixture';
// __tests__/usePartida.test.ts
import { describe, it, expect, vi, beforeEach, VitestUtils } from 'vitest';
import { computed, nextTick, ref } from 'vue';
import { usePartidas } from '../src/composables/apis/usePartidas';
import { Exceptions } from '../src/util/enum.exceptions';
import { supabase } from '../src/util/supabase';
import { Jogador, Partidas } from '../src/type';

// Mock the supabase module
vi.mock('../src/util/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock the usePlayer module
vi.mock('../src/composables/usePlayer', () => ({
  usePlayer: vi.fn(() => ({
    getMyself: ref({ isValid: true, seed: 'player1' }),
  })),
}));

const seed = ref('seed');
const getMyself = computed((): Jogador => ({
  seed: seed.value,
  avatarUrl: 'string',
  nickname: 'player 1',
  creator: false,
  color: 'red',
  isValid: !!seed.value
}))

describe.skip('usePartidas', () => {
  // mock useRoute and useRouter
  const route = { params: { id: 1 } };
  const router = { push: vi.fn() };
  beforeEach(() => {
    vi.clearAllMocks();
    seed.value = 'seed';
  });

  describe('initialize', () => {
    it('should throw MATCH_INVALID_ID when matchId is invalid', async () => {
      const { initialize } = usePartidas(getMyself);
;
      await expect(initialize({params: {id: '0'}}, router)).rejects.toBe(Exceptions.MATCH_INVALID_ID);
    });

    it('should throw USER_SESSION_NOT_FOUND when user is not valid', async () => {
      seed.value = '';
      const { initialize } = usePartidas(getMyself);

      await expect(initialize(route, router)).rejects.toBe(Exceptions.USER_SESSION_NOT_FOUND);
    });

    it('should set partida when supabase returns data', async () => {
      const partidaData = fixturePartida;

      // Mock the chain of methods for supabase.from().select().eq().single()
      const eqMock = vi.fn().mockReturnValue({ data: [partidaData], error: null })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      const fromMock = vi.fn().mockReturnValue({ select: selectMock });

      // Replace supabase.from with our mock
      (supabase as any).from = fromMock;

      const { initialize, partida } = usePartidas(getMyself);

      await initialize(route, router);

      expect(fromMock).toHaveBeenCalledWith('partidas');
      expect(selectMock).toHaveBeenCalled();
      expect(eqMock).toHaveBeenCalledWith('sala_id', 1);
      expect(partida.value).toEqual(partidaData);
    });

    it('should handle supabase error gracefully', async () => {
      // Mock supabase to return an error
      const eqMock = vi.fn().mockResolvedValue({ data: null, error: 'Some error' });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      const fromMock = vi.fn().mockReturnValue({ select: selectMock });

      // Replace supabase.from with our mock
      (supabase as any).from = fromMock;

      const { initialize, partida } = usePartidas(getMyself);

      await initialize(route, router);

      expect(partida.value).toBeNull();
    });
  });
  describe('supabase events', () => {

  let partidaData: Partidas

  beforeEach(() => {
    vi.clearAllMocks();
    partidaData = {
      id: 1,
      sala_id: 1,
      estado: 'iniciado',
      cartas_disponiveis: {},
      jogadores: [],
      rodada_atual: 1,
      acoes: [],
      created_at: new Date().toISOString(),
    };
  });

  it('subscribes to Supabase changes and handles updates', async () => {
    const mockCallback = vi.fn();

    // Mock the channel and its methods
    const onMock = vi.fn().mockReturnThis();
    const subscribeMock = vi.fn();
    const channelMock = vi.fn().mockReturnValue({
      on: onMock,
      subscribe: subscribeMock,
    });
    (supabase as any).channel = channelMock;

    const { subscribeToChanges, partida } = usePartidas(getMyself);

    // Call the function to subscribe to changes
    subscribeToChanges(1, mockCallback);

    // Expect channel to have been called with the correct channel name
    expect(channelMock).toHaveBeenCalledWith('room1');
    expect(onMock).toHaveBeenCalledWith(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'partidas' },
      expect.any(Function)
    );
    expect(subscribeMock).toHaveBeenCalled();

    // update partidaData with relevant ID
    partidaData.acoes.push({
      id: 1
    })

    // Simulate receiving a Supabase event update
    const payload = { new: { ...partidaData, estado: 'updated' } };
    onMock.mock.calls[0][2](payload); // Trigger the event callback

    // Verify that the composable updated `partida` and called the callback
    expect(partida.value).toEqual(payload.new);
    expect(partida.value?.acoes).toEqual(payload.new.acoes);
    expect(mockCallback).toHaveBeenCalledWith(payload.new);
  });
  })

  describe('updatePartida', () => {

    let partidaData: Partidas
    partidaData = {
      id: 1,
      sala_id: 1,
      estado: 'iniciado',
      cartas_disponiveis: {},
      jogadores: [],
      rodada_atual: 1,
      acoes: [],
      created_at: new Date().toISOString(),
    };
    beforeEach(() => {
      vi.clearAllMocks();

    });
    it('should update partida and set it to the new value', async () => {
      // Mock the supabase update method
      const updateMock = vi.fn().mockResolvedValue({ data: [partidaData], error: null });
      (supabase as any).from = vi.fn().mockReturnValue({ update: updateMock });

      const { updateRecord, partida } = usePartidas(getMyself);

      partidaData.acoes.push({
        jogadorId: getMyself.value.seed,
        cartaId: 1,
        acao: 'usar_carta',
        timestamp: new Date().toISOString()
      })

      await updateRecord(1, partidaData);
      await nextTick();

      expect(updateMock).toHaveBeenCalledWith(partidaData);
    })
  })
});
