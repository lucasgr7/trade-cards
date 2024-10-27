// src/composables/usePartidas.ts
import { ref, computed } from 'vue';
import { useSupaTable } from "../util/useSupaTable";
import { usePlayer } from './usePlayer';
import { supabase } from '../util/supabase';
import { Exceptions } from "../util/enum.exceptions";
import { useStorage } from '@vueuse/core';
import { Partidas, Cartas, Jogador } from "../type";
import { useRouter } from 'vue-router'; // Não usaremos para manter consistência nos testes



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
};

export function usePartidas() {
  const { records, error, insertRecord, getRecords, updateRecord, deleteRecord, getRecordById, search, createId } = useSupaTable<Partidas>("partidas", columns);
  const { getMyself } = usePlayer();
  // storage partida
  const partida = useStorage<Partidas | null>('partida', null);
  const cartaVisivel = ref<Cartas | null>(null);
  const partidaAtualizada = ref(false);
  const redirecionarPara = ref<string | null>(null);

  const verificarEstadoPartida = () => {
    if (partida.value && partida.value.estado !== 'iniciado') {
      redirecionarPara.value = 'wait-room';
    }
  };
  const esconderCarta = () => {
    cartaVisivel.value = null;
  };
  
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
    if (partida.value) {
      partida.value.acoes.push({
        jogadorId: getMyself.value.seed,
        cartaId: carta.id,
        acao: 'usar_carta',
        timestamp: new Date().toISOString()
      });
      // Atualizar a partida no servidor
      updatePartida(partida.value);
    }
  };
  const updatePartida = async (novaPartida: Partidas) => {
    const { data, error } = await supabase.from('partidas').update(novaPartida).eq('id', novaPartida.id);
    if (error) {
      console.error('Erro ao atualizar partida:', error);
      return;
    }
    if(!data){
      console.error('Erro ao atualizar partida:', 'data is null');
      return;
    }
    partida.value = data[0];
  };
  const possuiDeck = computed(() => {
    // check deck differs from empty object
    return partida.value && Object.keys(partida.value.cartas_disponiveis).length > 0;
  });
  
  
   
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
  

  const moverJogadoresParaPartida = (partidaId: number) => {
    // TODO - precisa colocar os jogadores na sala de espera em um websocket usando supabase.channel('room1')
    // depois que receberem um sinal de que o estado da partida mudou
    // para "iniciada", redirecionar para a página da partida
  };

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
    moverJogadoresParaPartida,
    initialize,
    subscribeToChanges,
    partida
  };
}
