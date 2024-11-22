import { CardType } from "./enums/cardType";
import { PartidaAcoes } from "./enums/partidas.actions";
import { StatusMatch } from "./enums/statusMatch";

export interface Deck {
  [cardName: string]: {
    count: number;
    tipo: CardType;
    descricao: string;
  };
}

export interface CartasType{
  nome: string;
  descricao: string;
  tipo: CardType;
  // define se a carta tem uma condição generativa como gerar uma carta que afeta um jogador específico
  isGenerative?: boolean;
  specificType?: string; // Add optional specificType property
  userSeed?: string;
}


// TypeScript interfaces
export interface Cartas {
  nome: string;
  descricao: string;
  tipo: CardType;
  isGenerative: boolean;
  image?: string;
  specificType?: string; // Para condições específicas
  id?: number;
}


export interface Acoes{
  acao: PartidaAcoes,
}

export interface Partidas {
  id?: number;
  created_at?: string;
  sala_id: number;
  cartas_disponiveis: Deck;
  jogadores: Jogador[];
  rodada_atual: number;
  acoes: Acoes[];
  atualizado_em?: string;
  estado: StatusMatch;
}

// Interface para o jogador
export interface Jogador {
  seed: string;
  avatarUrl: string;
  nickname: string;
  creator?: boolean;
  color?: string;
  isValid?: boolean;
  userSeed?: string;
}