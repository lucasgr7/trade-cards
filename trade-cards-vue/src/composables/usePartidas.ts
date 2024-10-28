// src/composables/usePartidas.ts
import { ref, computed, ComputedRef, Ref } from 'vue';
import { useSupaTable } from "../util/useSupaTable";
import { supabase } from '../util/supabase';
import { Exceptions } from "../util/enum.exceptions";
import { useStorage } from '@vueuse/core';
import { Partidas, Cartas, Jogador } from "../type";



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
const partida: Ref<Partidas | null> = useStorage<Partidas | null>('partida', null);;

export function usePartidas(getMyself: ComputedRef<Jogador>) {
  const { records, error, insertRecord, getRecords, updateRecord, deleteRecord, getRecordById, search, createId } = useSupaTable<Partidas>("partidas", columns);
  // storage partida
  const cartaVisivel = ref<Cartas | null>(null);
  const partidaAtualizada = ref(false);
  const redirecionarPara = ref<string | null>(null);

  
  const initialize = async (matchId: number) => {
    // should check if matchId is valid
    if(!matchId){
      throw Exceptions.MATCH_INVALID_ID;
    }
    if(!getMyself.value.isValid){
      throw Exceptions.USER_SESSION_NOT_FOUND;
    }
    // should make a request to the api
    partida.value = await getPartidaBySalaId(matchId);
  }
  const isInitialized = computed(() => partida.value !== null);

  const getPartidaBySalaId = async (salaId: number) => {
    const { data, error } = await supabase.from('partidas').select().eq('sala_id', salaId).single();
    if (error) {
      console.error('Erro ao buscar partida:', error);
      return;
    }
    return data;
  }

  const usarCarta = (carta: Cartas) => {
    // Lógica para usar a carta
    // Por exemplo, remover a carta do deck e adicionar às ações
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
      // Atualizar a partida no servidor
      updateRecord(partida.value.id, partida.value);
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
    isInitialized
  };
}
