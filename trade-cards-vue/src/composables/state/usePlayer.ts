// src/composables/usePlayer.ts
import { ref, computed, Ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { Jogador } from '../type';

const nickname = useStorage<string>('nickname', null);

export function usePlayer() {

  // Utilizando useStorage para persistir os dados no localStorage
  const seed = useStorage<string>('userSeed', generateRandomSeed());
  const avatarUrl = useStorage<string>('avatarUrl', getAvatarUrl(seed.value));

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
  function saveUserData(nicknameInput: string, isCreatorFlag: boolean = false): boolean {
    nickname.value = nicknameInput;
    isCreator.value = isCreatorFlag;
    return true;
  }

  // delete user data
  function deleteUserData() {
    seed.value = generateRandomSeed();
    avatarUrl.value = getAvatarUrl(seed.value);
    nickname.value = null;
    isCreator.value = false;
  }

  // Função para obter os dados do usuário
  const getMyself = computed((): Jogador => ({
    seed: seed.value,
    avatarUrl: avatarUrl.value,
    nickname: nickname.value,
    creator: isCreator.value,
    isValid: !!nickname.value,
  }));
    

  return {
    seed,
    avatarUrl,
    nickname,
    isCreator,
    generateAvatar,
    saveUserData,
    getMyself,
    deleteUserData
  };
}
