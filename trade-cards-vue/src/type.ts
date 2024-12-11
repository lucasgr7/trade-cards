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

export enum DeckGameType {
  Sun = 'sun',
  Moon = 'moon',
}

export enum CardTypeV3 {
  Action = 'action',
  Object = 'object',
  Condition = 'condition',
  Subtraction = 'subtraction',
}


export interface CartasType {
  nome: string; // seria o nome da carta apresentando "Homem", "Mulher", "Verde", "Calça"
  type: CardTypeV3;
  image?: string;
  weight?: number;
  compositions?: Composition[];
}

export interface Composition {
  value: string;
  description: string;
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

