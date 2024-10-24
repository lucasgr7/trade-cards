// src/composables/usePartidas.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useSupaTable } from "../util/useSupaTable";
import { Jogador } from './usePlayer';

// TypeScript interfaces
export interface Cartas {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'blue' | 'green' | 'yellow';
}


export interface Partidas {
  id?: number;
  created_at?: string;
  sala_id: number;
  cartas_disponiveis: Cartas[];
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
  
  // Função para remover uma carta do deck
  const removeCardFromDeck = async (salaId: number, cardId: number) => {
    const partida = await getRecordById(salaId);
    if (!partida) return;

    const updatedCartas = partida.cartas_disponiveis.filter((card: Cartas) => card.id !== cardId);
    await updateRecord(partida.id, { cartas_disponiveis: updatedCartas });
  };

  // Função para reembaralhar o deck
  const reshuffleDeck = async (salaId: number) => {
    const partida = await getRecordById(salaId);
    if (!partida) return;

    const shuffledCartas = shuffleArray<Cartas>(partida.cartas_disponiveis);
    await updateRecord(partida.id, { cartas_disponiveis: shuffledCartas });
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

  const criarPartida = async (salaId: number, players: Jogador[]): Promise<void> => {
    const partida = {
      created_at: new Date().toISOString(),
      sala_id: salaId,
      estado: "inicial",
      cartas_disponiveis: [],
      rodada_atual: 0,
      acoes: [],
      jogadores: players,
    };

    try{
      const novaPartida = await insertRecord(partida);
      return novaPartida;
    }
    catch(error){
      console.error('Erro ao criar partida:', error);
    }
    // TODO - redirecionar para a Partida
  };

  const gerarDeck = async (partidaId: number) => {
    // TODO
  };

  const moverJogadoresParaPartida = (partidaId: number) => {
    // TODO - precisa colocar os jogadores na sala de espera em um websocket usando supabase.channel('room1')
    // depois que receberem um sinal de que o estado da partida mudou
    // para "iniciada", redirecionar para a página da partida
  };

  return {
    // ... outras funções
    criarPartida,
    gerarDeck,
    moverJogadoresParaPartida,
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
    removeCardFromDeck,
    reshuffleDeck,
    subscribeToChanges,
  };
}
