import { Ref, nextTick } from "vue";
import { Cartas } from "./usePartidas";
import { gsap } from 'gsap';

export const useCardSwipe = (
	touchStartX: number, 
	touchMoveX: number,
	currentCardRef: Ref,
	cards: Ref<Cartas[]>,
	remainingCards: Ref<number>,
	isReStacking: Ref<boolean>,
	stackedCardRefs: any,
	initialCards: any[]) => {

	// Função para iniciar o swipe
	const startSwipe = (event) => {
		touchStartX = event.touches[0].clientX;
	};

	// Função para mover o swipe e dar o efeito de curva
	const moveSwipe = (event) => {
		touchMoveX = event.touches[0].clientX;
		const deltaX = touchMoveX - touchStartX;

		const currentCard = currentCardRef.value;

		if (currentCard) {
			gsap.to(currentCard, {
				x: deltaX,
				rotation: deltaX / 10,
				duration: 0,
				overwrite: 'auto',
			});
		}
	};

	// Função para finalizar o swipe e decidir se avança ou retorna
	const endSwipe = () => {
		const deltaX = touchMoveX - touchStartX;
		const threshold = 50; // Limite para considerar o swipe

		const currentCard = currentCardRef.value;

		if (!currentCard) return;

		if (deltaX > threshold) {
			// Swipe Right
			gsap.to(currentCard, {
				x: 300,
				opacity: 0,
				rotation: 15,
				duration: 0.5,
				ease: "power2.out",
				onComplete: () => {
					// Remove a carta do topo
					// log details of event
					console.log('Card removed right:', cards.value[cards.value.length - 1]);
					cards.value.pop();
					console.log('Cards:', cards.value);
					remainingCards.value--;

					// Resetar a carta
					gsap.set(currentCard, { x: 0, opacity: 1, rotation: 0 });

					// Verificar se todas as cartas foram removidas
					if (cards.value.length === 0) {
						recarregarPilha();
					}
				},
			});
		} else if (deltaX < -threshold) {
			// Swipe Left
			gsap.to(currentCard, {
				x: -300,
				opacity: 0,
				rotation: -15,
				duration: 0.5,
				ease: "power2.out",
				onComplete: () => {
					// Remove a carta do topo
					console.log('Card removed left:', cards.value[cards.value.length - 1]);
					cards.value.pop();
					console.log('Cards:', cards.value);
					remainingCards.value--;

					// Resetar a carta
					gsap.set(currentCard, { x: 0, opacity: 1, rotation: 0 });

					// Verificar se todas as cartas foram removidas
					if (cards.value.length === 0) {
						recarregarPilha();
					}
				},
			});
		} else {
			// Cancel Swipe
			gsap.to(currentCard, {
				x: 0,
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
			gsap.to(stackedCardRefs.value, {
				y: 0,
				opacity: 1,
				stagger: 0.1,
				duration: 0.5,
				ease: "power2.out",
				onComplete: () => {
					// Resetar as cartas para o estado inicial
					cards.value = [...initialCards];
					remainingCards.value = cards.value.length;
					isReStacking.value = false;
					stackedCardRefs.value = [];
				},
			});
		});
	};

	const removeCard = (carta: Cartas) => {
		const index = cards.value.indexOf(carta);
		if (index !== -1) {
			cards.value.pop();
			remainingCards.value--;
			if (cards.value.length === 0) {
				recarregarPilha();
			}
		}
  };

	return {
		startSwipe,
		moveSwipe,
		endSwipe,
		recarregarPilha,
		removeCard,
	};
}