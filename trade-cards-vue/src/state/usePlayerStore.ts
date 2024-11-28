
// stores/usePlayerStore.ts
import { defineStore } from 'pinia';
import { CartasType, Jogador } from '@/type';
import * as _ from 'lodash';


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
    defaultDeck: [] as CartasType[],
    signalResetDeck: false,
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
      this.deck = _.cloneDeep(this.defaultDeck);
      this.deck.sort(() => Math.random() - 0.5);
      this.signalResetDeck = !this.signalResetDeck;
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
