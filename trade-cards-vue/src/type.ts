import { finishTurn } from "./composables/apis/usePartidas";
import { CardType } from "./enums/cardType";
import { PartidaAcoes } from "./enums/partidas.actions";
import { EnumStatusPartida } from "./enums/EnumStatusPartida";

export interface Deck {
  [cardName: string]: {
    count: number;
    tipo: CardType;
    descricao: string;
  };
}


export enum CardTypeV3 {
  Action = 'action',
  Gift = 'gift',
  Seat = 'seat',
  Subtraction = 'subtraction',
}

export interface TradingCard {
  description: string;
  title: string;
  type: CardTypeV3;
  weight: number; // número de composições
  compositions?: Composition;
  image?: string;
  completeText?: string;
}

export interface Composition {
  [key: string]: string[];
}





export interface Acoes {
  acao: PartidaAcoes,
}

export interface Partidas {
  id?: number;
  created_at?: string;
  sala_id: number;
  cartas_disponiveis: any;
  jogadores: Jogador[];
  rodada_atual: number;
  acoes: finishTurn[];
  atualizado_em?: string;
  estado: EnumStatusPartida;
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

