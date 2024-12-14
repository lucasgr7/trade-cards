import { computed, ref, Ref } from "vue";
import { useSupaTable } from "@/util/useSupaTable";
import { Jogador } from "@/type";
import { supabase } from "@/util/supabase";
import { useSerializedStorage } from "@/util/storage";

export interface Salas {
  id?: number;
  created_at?: string;
  jogadores: Jogador[];
  estado: number;
  name: string;
}

const columns = {
  "created_at": {
    "type": "string",
    "nullable": true
  },
  "jogadores": {
    "type": "json",
    "nullable": true
  },
  "estado": {
    "type": "smallint",
    "nullable": true
  },
  "name": {
    "type": "string",
    "nullable": true
  }
};
const sala = useSerializedStorage<Salas | null>(null);

export function useSalas(myself?: Jogador) {
  const { records, error, insertRecord, getRecords, updateRecord, deleteRecord, getRecordById, search, createId } = useSupaTable<Salas>("salas", columns);

  const players = ref<Jogador[]>([]);

  function getPlayersCount(sala: Salas): number {
    return sala.jogadores ? sala.jogadores.length : 0;
  }

  function getSessionsCount(): number {
    return records.value?.length ?? 0;
  }

  async function deleteOldRecords() {
    await getRecords();

    const now = new Date();
    const cutoffDate = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(); // 48 hours ago
    const oldRecords = records.value?.filter((record) => record.created_at && record.created_at < cutoffDate) ?? [];
    
    for (const record of oldRecords) {
      try {
        // Deletar registros dependentes na tabela `partidas`
        const { error: deletePartidasError } = await supabase
          .from('partidas')
          .delete()
          .eq('sala_id', record.id);
  
        if (deletePartidasError) {
          console.error(`Failed to delete partidas for sala_id ${record.id}:`, deletePartidasError);
          continue;
        }
  
        // Deletar o registro na tabela `salas`
        await deleteRecord(record.id as number);
      } catch (error) {
        console.error(`Failed to delete record with id ${record.id}:`, error);
      }
    }

    await getRecords();
  }

  
  async function getPlayersFromSession(roomId: string | string[]): Promise<Jogador[] | void> {
    if (!roomId) return;

    const salaId = Number(roomId);
    const salaData = await getRecordById(salaId);

    if (!salaData) {
      alert('Sala não encontrada.');
      return;
    }

    sala.value = salaData;
    players.value = salaData.jogadores
      .filter((jogador: Jogador) => jogador.nickname !== myself?.nickname)
      .map((jogador: Jogador) => ({
        ...jogador,
        color: generateRandomColor()
      }));
  } 
  
  function generateRandomColor() {
    let color;
    do {
      color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    } while (color.toUpperCase() === '#FFFFFF'); // Evita cores brancas
    return color;
  }


  const subscribeToChanges = (salaId: number, callback: (payload: any) => void) => {
    supabase
    .channel('room' + salaId)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'salas' }, payload => {
      console.log('Change received!', payload.new)
      const playersExceptMyself = payload.new.jogadores.filter((jogador: Jogador) => jogador.nickname !== myself?.value?.nickname);
      players.value = playersExceptMyself;
      callback(payload.new)
    })
    .subscribe()
  }
    
  const isMyselfCreatorSession = computed(() => {
    console.log(sala.value?.jogadores[0]?.userSeed, myself?.userSeed)
    if(!sala.value || !myself){
      return false;
    }
    return sala.value?.jogadores[0]?.userSeed === myself?.userSeed;
  })
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
    getPlayersCount,
    getSessionsCount,
    deleteOldRecords,
    getPlayersFromSession,
    sala,
    players,
    isMyselfCreatorSession,
    subscribeToChanges
  };
}