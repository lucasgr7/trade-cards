import { computed, ref, Ref } from "vue";
import { useSupaTable } from "../util/useSupaTable";
import { Jogador } from "./usePlayer";

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

export function useSalas(myself?: Ref<Jogador>) {
  const { records, error, insertRecord, getRecords, updateRecord, deleteRecord, getRecordById, search, createId } = useSupaTable<Salas>("salas", columns);

  const sala = ref<Salas | null>(null);
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
        await deleteRecord(record.id as number);
      } catch (error) {
        console.error(`Failed to delete record with id ${record.id}:`, error);
        throw new Error(`Failed to delete record with id ${record.id}: ${error}`);
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
      .filter((jogador: Jogador) => jogador.nickname !== myself.value.nickname)
      .map((jogador: Jogador) => ({
        ...jogador,
        color: generateRandomColor()
      }));
  }
  
  const isMyselfCreatorSession = computed(() => {
    return sala.value?.jogadores[0].nickname === myself.value.nickname;
  })
  
  function generateRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
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
    getPlayersCount,
    getSessionsCount,
    deleteOldRecords,
    getPlayersFromSession,
    sala,
    players,
    isMyselfCreatorSession
  };
}