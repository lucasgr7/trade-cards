// stores/usePlayerStore.ts
import { defineStore } from 'pinia';
import { CartasType, Jogador } from '@/type';
import * as _ from 'lodash';
import { defaultWindow } from '@vueuse/core';
import { CardTypeV3, DeckGameType, Rarity } from '../type';

const MAX_CARDS_IN_BAG = 15;

function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 9);
}
export const usePlayerStore = defineStore('player', {
  state: () => ({
    nickname: '',
    userSeed: generateRandomSeed(),
    avatarUrl: '',
    isCreator: false,
    deck: [] as CartasType[],
    deckType: '' as DeckGameType,
    signalResetDeck: false,
    bagOfCards: [] as CartasType[],
    energyUnits: 0,
    currentEnergy: 0,
    listOfCommands: [] as string[],
  }),
  actions: {
    generateRandomSeed(): string {
      return Math.random().toString(36).substring(2, 9);
    },
    getAvatarUrl(seed: string): string {
      return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}`;
    },
    generateAvatar() {
      this.userSeed = this.generateRandomSeed();
      this.avatarUrl = this.getAvatarUrl(this.userSeed);
    },
    setAsCreator() {
      this.isCreator = true;
    },
    shuffleDeck() {
      this.addMissingActionCards();
      this.deck = _.shuffle(this.deck);
      this.signalResetDeck = !this.signalResetDeck;
    },
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    },
    checkActionCardsInDeck(): boolean {
      return this.deck.some((c: CartasType) => c.type === CardTypeV3.Action);
    },
    addMissingActionCards() {
      // visto que o jogador não pode ficar sem cartas de ação, adiciona algumas cartas de ação básicas quando não houver
      if (!this.checkActionCardsInDeck()) {
        const actionCards: CartasType[] = [
          { nome: 'Troca', type: CardTypeV3.Action, input: 'troca o', rarity: Rarity.basic, image: 'exchange.png', },
          { nome: 'Troca', type: CardTypeV3.Action, input: 'troca o', rarity: Rarity.basic, image: 'exchange.png', },
          { nome: 'Revelar', type: CardTypeV3.Action, input: 'revelar o', rarity: Rarity.basic, image: 'reveal.png', },
        ];
        this.deck.push(...actionCards);
      }
    },
    // métodos relacionados à bag de cartas
    canAddCardToBag(): boolean {
      // validação de máximo de cartas na bag
      if (this.bagOfCards.length >= MAX_CARDS_IN_BAG) {
        defaultWindow?.alert(`Você já tem ${MAX_CARDS_IN_BAG} cartas escolhidas, remova uma para adicionar outra!`);
        this.shuffleDeck();
        return false;
      }
      return true;
    },
    addToBagOfCards(card: CartasType) {
      if (!this.canAddCardToBag()) {
        return;
      }
      this.bagOfCards.push(card);
      const index = this.deck.findIndex((c) => c.nome === card.nome && c.type === card.type);
      if (index !== -1) {
        this.deck.splice(index, 1);
      }
    },
    removeOfBagOfCards(card: CartasType) {
      const index = this.bagOfCards.findIndex((c) => c.nome === card.nome && c.type === card.type);
      if (index !== -1) {
        this.bagOfCards.splice(index, 1);
      }
      this.deck.push(card); // carta retornada ao deck
      this.shuffleDeck();
    },
    clearBagOfCards() {
      this.bagOfCards = [];
    },
    // métodos relacionados à energia
    setTotalEnergyUnits(units: number) {
      this.energyUnits = units;
      this.currentEnergy = units * 100;
    },
    addEnergy(units: number) {
      if (this.currentEnergy + units <= this.energyUnits) {
        this.currentEnergy += units;
      }
    },
    removeEnergy(deck: DeckGameType) {
      if (deck == DeckGameType.Sun) {
        this.currentEnergy -= 3; // Baralho Sun: custo de 3 de energia para cada comando
      } else {
        this.currentEnergy -= 5; // Baralho Moon: custo de 5 de energia para cada comando
      }
    },
    // métodos relacionados à lista de comandos
    addCommandToList(command: string) {
      this.listOfCommands.push(command);
    },
    clearListOfCommands() {
      this.listOfCommands = [];
    },
  },
  getters: {
    getMyself(state): Jogador {
      return {
        seed: state.userSeed,
        avatarUrl: state.avatarUrl,
        nickname: state.nickname,
        creator: state.isCreator,
        isValid: state.nickname.length > 0 && state.avatarUrl.length > 0,
      };
    },
  },
  persist: true, // Ativa a persistência para esta store
});
