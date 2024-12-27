// stores/usePlayerStore.ts
import { defineStore } from 'pinia';
import { Jogador, TradingCard } from '@/type';
import * as _ from 'lodash';
import { CardTypeV3 } from '../type';
import { CardRevelearBuilder, CardTrocarBuilder } from '@/util/cardbuilder.class';
import { ref } from 'vue';
import { useCompositionEmojifier } from '@/composables/utils/useCompositionEmojifier';

const MAX_CARDS_IN_BAG = 4;
const showAlert = ref(false);
const alertMessage = ref('');

function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 9);
}
export const usePlayerStore = defineStore('player', {
  state: () => ({
    nickname: '',
    userSeed: generateRandomSeed(),
    avatarUrl: '',
    isCreator: false,
    deck: [] as TradingCard[],
    signalResetDeck: false,
    bagOfCards: [] as TradingCard[],
    currentHandWeight: 0,
    salaId: 0,
    currentRodada: 0,
    lastCard: {} as TradingCard,
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
      // Separate the cards by type
      const actionCards = this.deck.filter((c: TradingCard) => c.type === CardTypeV3.Action);
      const objectCards = this.deck.filter((c: TradingCard) => c.type === CardTypeV3.Gift || c.type === CardTypeV3.Seat);
      const otherCards = this.deck.filter((c: TradingCard) => c.type === CardTypeV3.Subtraction);

      // Shuffle each group of cards
      const shuffledActionCards = _.shuffle(actionCards);
      const shuffledObjectCards = _.shuffle(objectCards);
      const shuffledOtherCards = _.shuffle(otherCards);

      // Ensure the first card is an action card, the second is an object card, and the rest are random
      this.deck = [
        ..._.shuffle([...shuffledActionCards.slice(1), ...shuffledObjectCards.slice(1), ...shuffledOtherCards]),
        ...shuffledObjectCards.slice(0, 1),
        ...shuffledActionCards.slice(0, 1)
      ];

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
      return this.deck.some((c: TradingCard) => c.type === CardTypeV3.Action);
    },
    addMissingActionCards() {
      // visto que o jogador não pode ficar sem cartas de ação, adiciona algumas cartas de ação básicas quando não houver
      if (!this.checkActionCardsInDeck()) {
        const actionCards: TradingCard[] = [
          new CardTrocarBuilder().build(),
          new CardTrocarBuilder().build(),
          new CardRevelearBuilder().build()
        ];
        this.deck.push(...actionCards);
      }
    },
    // métodos relacionados à bag de cartas
    canAddCardToBag(card: TradingCard): boolean {
      // validação de máximo de cartas na bag
      if (this.bagOfCards.length >= MAX_CARDS_IN_BAG) {
        this.showAlertMessage(`Você já tem ${MAX_CARDS_IN_BAG} cartas escolhidas, remova uma para adicionar outra!`);
        this.shuffleDeck();
        return false;
      }
      // check if already has a card of action
      if (this.bagOfCards.some((c: TradingCard) => c.type === CardTypeV3.Action) && card.type === CardTypeV3.Action) {
        this.showAlertMessage('Você já tem uma carta de ação na sua bag, remova-a para adicionar outra!');
        this.shuffleDeck();
        return false;
      }
      // check if already if trying to insert an object (seat or gift) and already has a object
      if (this.bagOfCards.some((c: TradingCard) => c.type === CardTypeV3.Gift || c.type === CardTypeV3.Seat) &&
        (card.type === CardTypeV3.Gift || card.type === CardTypeV3.Seat)) {
        this.showAlertMessage('Você já tem um objeto na sua bag, remova-o para adicionar outro!');
        this.shuffleDeck();
        return false;
      }
      return true;
    },
    addToBagOfCards(card: TradingCard) {
      if (!this.canAddCardToBag(card)) {
        return;
      }
      this.bagOfCards.push(card);
      const index = this.deck.findIndex((c) => c.description === card.description && c.type === card.type);
      if (index !== -1) {
        this.deck.splice(index, 1);
      }
    },
    removeOfBagOfCards(card: TradingCard) {
      const index = this.bagOfCards.findIndex((c) => c.description === card.description && c.type === card.type);
      if (index !== -1) {
        this.bagOfCards.splice(index, 1);
      }
      this.deck.push(card); // carta retornada ao deck
    },
    clearBagOfCards() {
      this.bagOfCards = [];
    },
    checkCardType(cardType: CardTypeV3): boolean {
      return this.bagOfCards.some(card => card.type === cardType);
    },
    showAlertMessage(message: string): void {
      showAlert.value = true;
      alertMessage.value = message;
    },
    canFinishRound(): boolean {
      const hasActionCards = this.checkCardType(CardTypeV3.Action);
      const hasObjectCards = this.bagOfCards.some(card => card.type === CardTypeV3.Seat || card.type === CardTypeV3.Gift);
    
      if (!hasActionCards) {
        this.showAlertMessage('Você precisa adicionar uma carta de ação para finalizar a rodada!');
        return false;
      }
    
      if (!hasObjectCards) {
        this.showAlertMessage('Você precisa adicionar um objeto para finalizar a rodada!');
        return false;
      }
    
      return true;
    },
    setSalaId(salaId: number) {
      this.salaId = salaId;
    },
    setCurrentRodada(rodada: number) {
      this.currentRodada = rodada;
    },
    getCommandPhrase(): string {
      // return the command removing the negative cards
      const negativeCards = this.bagOfCards.filter((card) => card.type === CardTypeV3.Subtraction);
      const cards = this.bagOfCards || [];
      const actionCards = cards.filter((card) => card.type === CardTypeV3.Action);
      const objectCards = cards.filter((card) => card.type === CardTypeV3.Gift || card.type === CardTypeV3.Seat);
      let phrase = actionCards.map((card) => card.completeText).join(' ');
      // concat the object cards
      phrase += ' ' + objectCards.map((card) => card.completeText).join(' ');
      negativeCards.forEach((card) => {
        phrase = phrase.replace(card.description, '');
      });

      // calculate the weight base on the active cards weight value subtract all the negative cards
      this.currentHandWeight = actionCards.reduce((acc, card) => acc + card.weight, 0) - negativeCards.length;
      return phrase;
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
    getDeck(state): TradingCard[] {
      return state.deck.map(card => {
        const completeText = card.compositions
          ? `${card.description} ${Object.values(card.compositions).flat().join(', ')}`
          : card.description;
        return { ...card, completeText };
      });
    },
    getCompleteCommandPhrase(state): string {
      // should organize the cards by type, first the action, then the object

      const { friendlyCompositionMessage } = useCompositionEmojifier();
    
      const cards = state.bagOfCards || [];
      const actionCards = cards.filter((card) => card.type === CardTypeV3.Action);
      const objectCards = cards.filter((card) => card.type === CardTypeV3.Gift || card.type === CardTypeV3.Seat);
      const negativeCards = cards.filter((card) => card.type === CardTypeV3.Subtraction);
    
      // start compiling the phrase starting the action cards
      let phrase = actionCards.map((card) => card.completeText).join(' ');

      // if card type is Gift add the word "Presente" 
      objectCards.forEach((card) => {
        if (card.type === CardTypeV3.Gift) {
          phrase += ' o Presente';
        }
        if (card.type === CardTypeV3.Seat) {
          phrase += ' a Cadeira';
        }
      });

      // concat the object cards
      phrase += ' ' + objectCards.map((card) => friendlyCompositionMessage(card, false)).join(' ');
    
      // now identify the negative cards on the phrase and if found the exact word edit to include a cross on the word
      negativeCards.forEach((card) => {
        phrase = phrase.replace(card.description, `<s>${card.description}</s>`);
      });
    
      return phrase;
    }
  },
  persist: true, // Ativa a persistência para esta store
});

export {
  showAlert,
  alertMessage
};

