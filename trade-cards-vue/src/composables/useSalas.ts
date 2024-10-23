import { useSupaTable } from "../util/useSupaTable";

export interface salas {
  id: number;
  created_at: string;
  jogadores: any[];
  estado: number;
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
  }
};


export function useSalas() {
  return useSupaTable<salas>("salas", columns);
}