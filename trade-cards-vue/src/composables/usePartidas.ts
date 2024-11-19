// src/composables/usePartidas.ts
import { ref, computed, ComputedRef, Ref } from 'vue';
import { useSupaTable } from "../util/useSupaTable";
import { supabase } from '../util/supabase';
import { Exceptions } from "../util/enum.exceptions";
import { Partidas, Cartas, Jogador } from "../type";
import { useSerializedStorage } from '@/util/storage';

const columns = {
  "created_at": {
    "type": "string",
    "nullable": true
  },
  "sala_id": {
    "type": "json",
    "nullable": true
  },
  "estado": {
    "type": "text",
    "nullable": true
  },
  "name": {
    "type": "string",
    "nullable": true
  },
  "cartas_disponiveis": {
    "type": "json",
    "nullable": true
  },
  "jogadores": {
    "type": "json",
    "nullable": true
  },
  "rodada_atual": {
    "type": "integer",
    "nullable": true
  },
  "acoes": {
    "type": "json",
    "nullable": true
  }
}
const partida: Ref<Partidas | null> = useSerializedStorage<Partidas | null>('partida', null);;

export function usePartidas(getMyself: ComputedRef<Jogador>) {
  const { records, error, insertRecord, getRecords, updateRecord, deleteRecord, getRecordById, search, createId } = useSupaTable<Partidas>("partidas", columns);
  // storage partida
  const cartaVisivel = ref<Cartas | null>(null);
  const partidaAtualizada = ref(false);
  const redirecionarPara = ref<string | null>(null);
  
  const initialize = async (route: any, router: any) => {
    try {
      const matchId = Number(route.params.id);
      // should check if matchId is valid
      if (!matchId) {
        throw Exceptions.MATCH_INVALID_ID;
      }
      if (!getMyself?.value.isValid) {
        throw Exceptions.USER_SESSION_NOT_FOUND;
      }
      // should make a request to the api
      partida.value = await getPartidaBySalaId(matchId);
    } catch (error: any) {
      if (error.message === Exceptions.MATCH_INVALID_ID || error.message === Exceptions.PARTIDA_NOT_FOUND) {
        router.push({ name: 'UserRegister' });
      } else {
        console.error(error);
      }
    }
  };

  const isInitialized = computed(() => partida.value !== null);
  
  const getPartidaBySalaId = async (salaId: number) => {
    const { data, error } = await supabase
    .from('partidas')
    .select('*', { count: 'exact' })
    .eq('sala_id', salaId);

    if (error) {
      console.error('Erro ao buscar partida:', error);
      return;
    }

    return data[0];
  }

  const removerCartaDoDeck = async (partida: Partidas, carta: Cartas) => {
    const cartaDisponivel = partida.cartas_disponiveis[carta.nome];
    if (cartaDisponivel && cartaDisponivel.count > 0) {
      partida.cartas_disponiveis[carta.nome].count--;
    } else {
      throw new Error(`Carta ${carta.nome} não disponível ou count já é zero.`);
    }
    
  
    // Atualizar a partida
    await updateRecord(partida?.id, partida);
  };

  const usarCarta = (carta: Cartas) => {
    if(!partida.value || !partida.value.id){
      throw Exceptions.PARTIDA_NOT_FOUND;
    }
    if (partida.value) {
      partida.value.acoes.push({
        jogadorId: getMyself.value.seed,
        cartaId: carta.id,
        acao: 'usar_carta',
        timestamp: new Date().toISOString()
      });
      removerCartaDoDeck(partida.value, carta);
    }
  };

  const subscribeToChanges = (salaId: number, callback: (payload: any) => void) => {
    supabase
      .channel('room' + salaId)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'partidas' }, payload => {
        console.log('Change received!', payload.new);
        partida.value = payload.new as Partidas;
        partidaAtualizada.value = true;
        callback(payload.new);
      })
      .subscribe();
  };
  
 const verificarEstadoPartida = () => {
    if (partida.value && partida.value.estado !== 'iniciado') {
      redirecionarPara.value = 'wait-room';
    }
  };
  const esconderCarta = () => {
    cartaVisivel.value = null;
  };;

  return {
    records,
    error,
    insertRecord,
    getRecords,
    updateRecord,
    deleteRecord,
    getRecordById,
    search,
    createId,
    getPartidaBySalaId,
    initialize,
    subscribeToChanges,
    partida,
    isInitialized,
    usarCarta,
    removerCartaDoDeck,
  };
}
