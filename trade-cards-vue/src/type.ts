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

export enum CardTypeV2 {
  Action = 'action',
  Object = 'object',
  Condition = 'condition',
  Connection = 'connection',
  Color = 'color',
  Joker = 'joker'
}

export enum Rarity {
  basic = 'basic',
  common = 'common',
  rare = 'rare',
  epic = 'epic',
  joker = 'joker'
}

export interface CartasType {
  description: any;
  nome: string; // seria o nome da carta apresentando "Homem", "Mulher", "Verde", "Calça"
  input: string; // seria o input que vai para o LLM gerar a palavra como "na cor Verde", "usando a calça"
  type: CardTypeV2;
  rarity: Rarity;
  image?: string;
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