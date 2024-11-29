import { ref } from 'vue';
import { CartasType } from '@/type';

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
  const ranking = ref('');

  const fetchChatCompletion = async (cartas: CartasType[]): Promise<void> => {
    loading.value = true;
    const defaultIntroConentet: string = '**Crie um comando usando todas essas palavras**:'

    const userContent = cartas
      .map((carta) => carta.input)
      .sort(() => Math.random() - 0.5)
      .join(' ');
    const url = `${import.meta.env.VITE_LLM_URL}/v1/chat/completions`;
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
              content: `Você é um auxiliar de um jogo, irá gerar um comando as palavras passadas pelo jogador
          que contenha uma palavra que faça sentido, suas prioridades são: 
          1. A frase deve ser um comando de ação, 
          2. A frase deve conter todas as palavras inseridas
          3. A frase tem que ser apenas o comando
          4. Palavras chave como 'Troca' devem ser usadas em frases como 'Troca os assentos' ou 'Troca os presentes'
          5. Palavras chave como 'Revela' devem ser usadas em frases como 'Revela o assento' ou 'Revela o presente'
          6. Comece o comando com 'O comando:'
          `
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
    const defaultIntroConentet: string = `**Crie uma nota de 0 a 10 para a instrução, o percentual é ${percentageCoverageWords.toFixed(2)}**`;
    const url = `${import.meta.env.VITE_LLM_URL}/v1/chat/completions`;
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
              content: `Você é um Juíz de um jogo simpels de troca de presentes, será apresentado um percentual e um comando
              O objetivo do jogo é criar comandos para serem executados pelos jogadores.
              Originalidade e criativdade devem ser mal vistos e penalizados, pois quebram a dinamica
              Palavras como 'Trocar presente', 'Trocar assento', 'Revelar presente' devem ser bem pontuados
              pois atingem o ponto chave do jogo. De uma nota de 0 a 10 e justifique a nota.
              Se o comando for perfeito, apenas diga 'Perfeito' e dê a nota 10
              Caso acha incoerencia reformule o comando começando com "Sugestão:"
          `
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