import { useSupaTable } from "../util/useSupaTable";

export interface Salas {
  id: number;
  created_at: string;
  jogadores: any[];
  estado: number;
  name: string;
}

const columns = {
  "id": {
    "type": "key",
    "nullable": false
  },
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
    getSessionsCount
  };
}