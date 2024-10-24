// src/composables/usePlayer.ts
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

// Interface para o jogador
export interface Jogador {
  seed: string;
  avatarUrl: string;
  nickname: string;
  creator?: boolean;
}

export function usePlayer() {
  const router = useRouter();

  // Utilizando useStorage para persistir os dados no localStorage
  const seed = useStorage<string>('userSeed', generateRandomSeed());
  const avatarUrl = useStorage<string>('avatarUrl', getAvatarUrl(seed.value));
  const nickname = useStorage<string>('nickname', '');

  // Computed para determinar se o usuário é o criador
  const isCreator = ref(false);

  // Função para gerar um seed aleatório
  function generateRandomSeed(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  // Função para obter a URL do avatar baseado no seed
  function getAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}`;
  }

  // Função para gerar um novo avatar
  function generateAvatar() {
    seed.value = generateRandomSeed();
    avatarUrl.value = getAvatarUrl(seed.value);
  }

  // Função para salvar os dados do usuário e redirecionar
  function saveUserData(nicknameInput: string, isCreatorFlag: boolean = false) {
    nickname.value = nicknameInput;
    isCreator.value = isCreatorFlag;
    router.push('/sessions');
  }

  // Função para obter os dados do usuário
  const getMyself = computed((): Jogador => ({
    seed: seed.value,
    avatarUrl: avatarUrl.value,
    nickname: nickname.value,
    creator: isCreator.value,
  }));

  return {
    seed,
    avatarUrl,
    nickname,
    isCreator,
    generateAvatar,
    saveUserData,
    getMyself,
  };
}
