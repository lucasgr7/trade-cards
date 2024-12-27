// trade-cards-vue/src/composables/useCardSwipe.ts
import { Ref, nextTick, watch } from 'vue';
import { gsap } from 'gsap';
import { TradingCard } from '@/type';
import { usePlayerStore } from '@/state/usePlayerStore';

export function useCardSwipe(
  cardRefs: Ref<HTMLElement[]>,
  cardsInHand: Ref<TradingCard[]>,
  topCardIndex: Ref<number>,
  onSwipeUp: () => void,
) {
  let touchStartX = 0;
  let touchStartY = 0;
  const animationDuration = 0.15;
  const lastCard: TradingCard[] = [];
  const playerStore = usePlayerStore();

  watch(() => playerStore.signalResetDeck, () => {
    lastCard.length = 0;
  });

  function startSwipe(event: TouchEvent) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }

  function moveSwipe(event: TouchEvent) {
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    const currentCard = cardRefs.value[topCardIndex.value];
    if (currentCard) {
      gsap.to(currentCard, {
        x: deltaX,
        y: deltaY,
        rotation: deltaX / 10,
        duration: 0,
      });
    }

    // Mover ligeiramente a carta abaixo
    if (topCardIndex.value > 0) {
      const nextCard = cardRefs.value[topCardIndex.value - 1];
      if (nextCard) {
        gsap.to(nextCard, {
          x: deltaX * 0.1,
          y: -((cardsInHand.value.length - (topCardIndex.value - 1) - 1) * 5) + deltaY * 0.1,
          duration: 0,
        });
      }
    }
  }

  function endSwipe() {
    const currentCard = cardRefs.value[topCardIndex.value];
    if (!currentCard) return;

    const thresholdX = 100; // Limiar para swipe horizontal
    const thresholdY = 100; // Limiar para swipe vertical
    const currentX = gsap.getProperty(currentCard, 'x') as number;
    const currentY = gsap.getProperty(currentCard, 'y') as number;

    if (Math.abs(currentX) > thresholdX) {
      // Swipe horizontal: remover carta da pilha
      gsap.to(currentCard, {
        x: currentX > 0 ? 500 : -500,
        y: currentY,
        rotation: currentX > 0 ? 45 : -45,
        duration: animationDuration,
        onComplete: () => {
          const poppedCard = cardsInHand.value.pop();
          if (poppedCard) {
            lastCard.push(poppedCard);
          }
        },
      });
    } else if (currentY < -thresholdY) {
      // Swipe para cima: selecionar carta
      gsap.to(currentCard, {
        y: -500,
        duration: animationDuration,
        onComplete: () => {
          // Lógica para seleção da carta
          onSwipeUp();
          cardsInHand.value.pop();
          // Ação adicional ao selecionar a carta (se necessário)
        },
      });
    } else {
      // Resetar posição
      gsap.to(currentCard, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: animationDuration,
      });

      // Resetar a carta abaixo
      if (topCardIndex.value > 0) {
        const nextCard = cardRefs.value[topCardIndex.value - 1];
        if (nextCard) {
          gsap.to(nextCard, {
            x: 0,
            y: -((cardsInHand.value.length - (topCardIndex.value - 1) - 1) * 5),
            duration: animationDuration,
          });
        }
      }
    }
  }

  async function resetLastCard() {
    const card = lastCard.pop();
    if (card) {
      cardsInHand.value.push(card);
      await nextTick();
      const cardElement = cardRefs.value[cardsInHand.value.length - 1];
      if (cardElement) {
        gsap.set(cardElement, { x: 500, opacity: 0 });
        gsap.to(cardElement, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)"
        });
      }
    }
  }

  return {
    startSwipe,
    moveSwipe,
    endSwipe,
    resetLastCard
  };
}