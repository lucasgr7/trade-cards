// src/composables/usePartidas.ts
import { ref, computed, Ref } from 'vue';
import { useSupaTable } from '../../util/useSupaTable';
import { supabase } from '../../util/supabase';
import { Exceptions } from '../../util/enum.exceptions';
import { Partidas, Jogador } from "@/type";
import { useSerializedStorage } from "../../util/storage";

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

export interface finishTurn{
  hash?: string;
  Jogador: Jogador,
  weight: number;
  time: number;
  command: string;
  round?: number;
}
const partida: Ref<Partidas | null> = useSerializedStorage<Partidas | null>('partida', null);;

export function usePartidas(getMyself: Jogador | null) {
  const { records, error, insertRecord, getRecords, updateRecord, deleteRecord, getRecordById, search, createId } = useSupaTable<Partidas>("partidas", columns);
  // storage partida
  const partidaAtualizada = ref(false);
  
  const initialize = async (route: any, router: any) => {
    try {
      const matchId = Number(route.params.id);
      // should check if matchId is valid
      if (!matchId) {
        throw Exceptions.MATCH_INVALID_ID;
      }
      if (!getMyself!.isValid) {
        throw Exceptions.USER_SESSION_NOT_FOUND;
      }
      // should make a request to the api
      partida.value = await getPartidaBySalaId(matchId);
    } catch (error: any) {
      if (error.message === Exceptions.MATCH_INVALID_ID || error.message === Exceptions.PARTIDA_NOT_FOUND) {
        router.push({ name: 'UserRegister' });
      } else {
        console.error(error);
        throw error;
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
      return null;
    }

    return data[0];
  }


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
    
  const isMyselfAdmin = computed((): boolean => {
    if(!partida.value || !getMyself){
      return false;
    }
    return partida.value?.jogadores[0]?.seed === getMyself.seed;
  })

  function generateHash(){
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  async function finishTurn(data: finishTurn): Promise<boolean> {
    const hash = generateHash();
    const maxRetries = 3;
    let attempts = 0;

    if (!partida.value) {
      return false;
    }

    while (attempts < maxRetries) {
      try {
        // Fetch the latest partida from the database
        const latestPartida = await getPartidaBySalaId(partida.value.sala_id);
        if (!latestPartida) {
          throw new Error('Partida not found');
        }

        // Create the new action
        const newAcoes = {
          hash,
          Jogador: data.Jogador,
          weight: data.weight,
          time: Date.now(),
          command: data.command,
          round: latestPartida.rodada_atual
        };

        // Append the new action to the existing acoes array
        const updatedAcoes = latestPartida.acoes ? [...latestPartida.acoes, newAcoes] : [newAcoes];

        // Attempt to update the partida with the new acoes
        await updateRecord(latestPartida.id!, { acoes: updatedAcoes });

        // Add a 5-second wait
        new Promise(res => setTimeout(res, 5000));

        // New verification query after the wait
        const verifiedPartida = await getPartidaBySalaId(latestPartida.sala_id);
        if (verifiedPartida && verifiedPartida.acoes.some(a => a.hash === hash)) {
          partida.value = verifiedPartida;
          return true;
        }

        throw new Error('Verification failed: New action not found.');
      } catch (e) {
        console.error(`Attempt ${attempts + 1} to finish turn failed:`, e);
        attempts += 1;

        if (attempts >= maxRetries) {
          console.error('Max retries reached. Failed to finish turn.');
          return false;
        }

        // Optional: Add a short delay before retrying
        await new Promise(res => setTimeout(res, 100));
      }
    }

    return false;
  }

  async function nextTurn() {
    if(!partida.value){
      return false;
    }
    try{
      partida.value.rodada_atual = partida.value.rodada_atual + 1;
      await updateRecord(partida.value.id!, partida.value);
    }
    catch(e){
      console.error('Erro ao finalizar turno:', e);
      return false;
    }
    finally{
      return true;
    }
  }
  
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
    isMyselfAdmin,
    finishTurn,
    nextTurn
  };
}
