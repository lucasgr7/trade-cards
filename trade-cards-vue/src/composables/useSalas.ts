import { useSupaTable } from "../util/useSupaTable";

export interface Salas {
  id?: number;
  created_at?: string;
  jogadores: any[];
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

export function useSalas() {
  const { records, error, insertRecord, getRecords, updateRecord, deleteRecord, getRecordById, search, createId } = useSupaTable<Salas>("salas", columns);

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
    deleteOldRecords
  };
}