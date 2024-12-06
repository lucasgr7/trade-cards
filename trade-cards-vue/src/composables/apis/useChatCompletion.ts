import { ref } from 'vue';
import { CartasType } from '@/type';
import { CardTypeV2 } from '../../type';

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
    logprobs: null | unknown;
  }>;
  system_fingerprint: string;
}

export function useChatCompletion() {
  const response = ref<ChatCompletionResponse | null>(null);
  const error = ref<null | unknown>(null);
  const loading = ref(false);
  const ranking = ref('')
  const url = `${import.meta.env.VITE_LLM_URL}/v1/chat/completions`;

  const fetchChatCompletion = async (cartas: CartasType[]): Promise<void> => {
    loading.value = true;
    const defaultIntroConentet: string = '**Crie um comando usando todas essas palavras**:'

    const userContent = cartas
      .map((carta) => carta.input)
      .sort(() => Math.random() - 0.5)
      .join(' ');
    const url = `${import.meta.env.VITE_LLM_URL}/v1/chat/completions`;
    const system = `Você é um auxiliar de um jogo, irá gerar um comando as palavras passadas pelo jogador
    que contenha uma palavra que faça sentido, suas prioridades são: 
    1. A frase deve ser um comando de ação, 
    2. A frase deve conter todas as palavras inseridas
    3. A frase tem que ser apenas o comando
    4. Palavras chave como 'Troca' devem ser usadas em frases como 'Troca os assentos' ou 'Troca os presentes'
    5. Palavras chave como 'Revela' devem ser usadas em frases como 'Revela o assento' ou 'Revela o presente'
    6. Comece o comando com 'O comando:'
    7. Não retorne notas, comentários ou sugestões
    `;

    const haveAction = cartas.some((carta) => carta.type === CardTypeV2.Action);
    if (!haveAction) {
      alert('Você precisa ter uma carta de ação (Carta Azul) para gerar um comando!');
      loading.value = false;
      return;
    }

    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "meta-llama-3-8b-instruct:2",
          messages: [
            {
              role: "system",
              content: system
            },
            {
              role: "user",
              content: `${defaultIntroConentet} ${userContent}`
            }
          ],
          temperature: 0.8,
          max_new_tokens: 150,
          top_p: 0.7
        })
      });
      const data = await result.json();
      response.value = data;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };
  //create a fetchChatCompletionRankingInstruction that should give a S to F to ranking how direct the instruction is
  const fetchChatCompletionRankingInstruction = async (command: string, percentageCoverageWords: number): Promise<void> => {
    loading.value = true;
    const defaultIntroConentet: string = `** Crie uma nota de 0 a 10 para a instrução, o percentual é ${percentageCoverageWords.toFixed(2)} ** `;
    const system = `You are a judge of a simple gift exchange game, a percentage and a command will be presented
    The goal of the game is to create commands to be executed by the players.
    Originality and creativity should be frowned upon and penalized, as they break the dynamics
    1. Words like 'Exchange gift', 'Exchange seat', 'Reveal gift' should be well scored
    2. If it consists of Action followed by defining a target or multiple targets, it is a good command
    3. Give a score from 0 to 10 and justify the score.
    4. Provide a corrected version with: "Suggestion:"
    5. Defining targets using clothing is part of the game, and helps increase the target
    Output only the score value from 0 to 10
  `
    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "meta-llama-3-8b-instruct:2",
          messages: [
            {
              role: "system",
              content: system
            },
            {
              role: "user",
              content: `${defaultIntroConentet} ${command} `
            }
          ],
          temperature: 0.8,
          max_new_tokens: 150,
          top_p: 0.7
        })
      });
      const data = await result.json() as ChatCompletionResponse;
      ranking.value = data.choices[0].message.content;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    response,
    error,
    loading,
    fetchChatCompletion,
    fetchChatCompletionRankingInstruction,
    ranking
  };
}