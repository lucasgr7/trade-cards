import { Ref, nextTick } from "vue";
import { Cartas } from "./usePartidas";
import { gsap } from 'gsap';

export const useCardSwipe = (
    currentCardRef: Ref,
    cardsInHand: Ref<Cartas[]>,
    remainingCards: Ref<number>,
    isReStacking: Ref<boolean>,
    stackedCardRefs: any,
    initialCards: any[],
    onSwipeUp: () => void, // 1. Recebe a função de callback para swipe para cima
    onDiscard: () => void, // 2. Recebe a função de callback para descartar a carta
) => {
    let touchStartX = 0;
    let touchMoveX = 0;
    let touchStartY = 0;
    let touchMoveY = 0;

    // Função para iniciar o swipe
    const startSwipe = (event: TouchEvent) => {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY; // Armazena a posição inicial Y
    };

    // Função para mover o swipe e dar o efeito de curva
    const moveSwipe = (event: TouchEvent) => {
        const touch = event.touches[0];
        touchMoveX = touch.clientX;
        touchMoveY = touch.clientY; // Atualiza a posição Y durante o movimento

        const deltaX = touchMoveX - touchStartX;
        const deltaY = touchMoveY - touchStartY;

        const currentCard = currentCardRef.value;

        if (currentCard) {
            gsap.to(currentCard, {
                x: deltaX,
                y: deltaY, // Aplica a movimentação vertical
                rotation: deltaX / 10,
                duration: 0,
                overwrite: 'auto',
            });
        }
    };

    // Função para finalizar o swipe e decidir se avança ou retorna
    const endSwipe = () => {
        const deltaX = touchMoveX - touchStartX;
        const deltaY = touchMoveY - touchStartY;
        const thresholdX = 50; // Limite para considerar o swipe horizontal
        const thresholdY = -100; // Limite para considerar o swipe para cima (negativo para subir)

        const currentCard = currentCardRef.value;

        if (!currentCard) return;

        if (deltaY < thresholdY) {
            // Swipe Up
            gsap.to(currentCard, {
                y: -window.innerHeight, // Move o card para fora da tela para cima
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    onSwipeUp();
                    resetCardPosition(currentCard);
                },
            });
        } else if (deltaX > thresholdX) {
            // Swipe Right
            gsap.to(currentCard, {
                x: 300,
                opacity: 0,
                rotation: 15,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    popCard();
                    onDiscard();
                    resetCardPosition(currentCard);
                },
            });
        } else if (deltaX < -thresholdX) {
            // Swipe Left
            gsap.to(currentCard, {
                x: -300,
                opacity: 0,
                rotation: -15,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    popCard();
                    onDiscard();
                    resetCardPosition(currentCard);
                },
            });
        } else {
            // Cancel Swipe
            gsap.to(currentCard, {
                x: 0,
                y: 0, // Reseta a posição vertical
                rotation: 0,
                duration: 0.5,
                ease: "power2.out",
            });
        }
    };

    // Função para recarregar a pilha de cartas (reempilhamento)
    const recarregarPilha = () => {
        isReStacking.value = true;

        nextTick(() => {
            // Resetar as posições iniciais das cartas empilhadas
            gsap.set(stackedCardRefs.value, { y: -50, opacity: 0 });

            // Animar todas as cartas empilhadas verticalmente com um efeito de deslizamento

            // esta dando erro aqui: GSAP target  not found.
            // o initialCards esta vazio e não esta sendo preenchido
            gsap.to(stackedCardRefs.value, {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    // Resetar as cartas para o estado inicial
                    cardsInHand.value = [...initialCards];
                    remainingCards.value = cardsInHand.value.length;
                    isReStacking.value = false;
                    stackedCardRefs.value = [];
                },
            });
        });
    };

    const removeCard = (carta?: Cartas) => {
        const index = cardsInHand.value.indexOf(carta);
        if (index !== -1) {
            popCard();
        }
    };

    function popCard(){
        cardsInHand.value.pop();
        remainingCards.value--;
        if (cardsInHand.value.length === 0) {
            recarregarPilha();
        }
    }
    
    function resetCardPosition(currentCard: Cartas) {
        gsap.set(currentCard, { x: 0, y: 0, opacity: 1, rotation: 0 });

        // Verificar se todas as cartas foram removidas
        if (cardsInHand.value.length === 0) {
            recarregarPilha();
        }
    }

    return {
        startSwipe,
        moveSwipe,
        endSwipe,
        recarregarPilha,
        removeCard,
    };
};
