// src/composables/usePartidas.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useSupaTable } from "@/util/useSupaTable";
import { Jogador } from './usePlayer';
import { Deck } from './useDeck';
import { supabase } from '@/util/supabase';

// TypeScript interfaces
export interface Cartas {
  nome: string;
  descricao: string;
  tipo: 'action' | 'object' | 'condition';
  isGenerative: boolean;
  image?: string;
  specificType?: string; // Para condições específicas
  id?: number;
}

export interface Partidas {
  id?: number;
  created_at?: string;
  sala_id: number;
  cartas_disponiveis: Deck;
  jogadores: Jogador[];
  rodada_atual: number;
  acoes: any[];
  atualizado_em?: string;
  estado: string;
}

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
  

  // Função para reembaralhar o deck
  const reshuffleDeck = async (salaId: number) => {
    const partida = await getRecordById(salaId);
    if (!partida) return;
  };

  // Função para embaralhar um array
  const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for(let i = shuffled.length -1; i >0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Função para assinar mudanças no Supabase
  const subscribeToChanges = (salaId: number, callback: (payload: any) => void) => {
    const supabaseUrl = 'https://your-supabase-url.supabase.co'; // Substitua pela sua URL do Supabase
    const supabaseKey = 'your-anon-key'; // Substitua pela sua chave anônima do Supabase
    const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

    supabase
      .channel(`room-${salaId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'partidas', filter: `sala_id=eq.${salaId}` },
        payload => {
          callback(payload);
        }
      )
      .subscribe();
  };

  const getPartidaBySalaId = async (salaId: number) => {
    const { data, error } = await supabase.from('partidas').select().eq('sala_id', salaId).single();
    if (error) {
      console.error('Erro ao buscar partida:', error);
      return;
    }
    return data;
  }

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
    reshuffleDeck,
    subscribeToChanges,
    getPartidaBySalaId,
    moverJogadoresParaPartida,
  };
}
