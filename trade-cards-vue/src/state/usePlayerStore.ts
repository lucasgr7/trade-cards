
// stores/usePlayerStore.ts
import { defineStore } from 'pinia';
import { CartasType, Jogador } from '@/type';
import * as _ from 'lodash';
import { defaultWindow } from '@vueuse/core';

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
    signalResetDeck: false,
    bagOfCards: [] as CartasType[],
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
      this.deck = _.shuffle(this.deck);
      this.signalResetDeck = !this.signalResetDeck;
    },
    canAddCard(): boolean {
      // validação de máximo de cartas na bag
      if (this.bagOfCards.length >= MAX_CARDS_IN_BAG) {
        defaultWindow.alert(`Você já tem ${MAX_CARDS_IN_BAG} cartas escolhidas, remova uma para adicionar outra!`);
        this.shuffleDeck();
        return false;
      }
      return true;
    },
    addToBagOfCards(card: CartasType) {
      if (!this.canAddCard()) {
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
    }
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
