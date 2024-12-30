import { TradingCard } from "@/type";


export function useCompositionEmojifier() {
  const emojiMap: { [key: string]: string } = {
      'embrulhado': '🎁',
      'desembrulhado': '📦',
      'verde': '🟢',
      'vermelho': '🔴',
      'azul': '🔵',
      'amarelo': '🟡',
      'preto': '⚫',
      'branco': '⚪',
      'rosa': '🌸',
      'roxo': '🟣',
      'laranja': '🟠',
      'de um homem': '👨',
      'de uma mulher': '👩',
      'usando camisa': '👕',
      'usando calça': '👖',
      'usando vestido': '👗',
      'usando bermuda': '🩳',
      'a minha frente': '⬆️',
      'a minha direita': '➡️',
      'a minha esquerda': '⬅️',
      'entre duas mulheres': '👭',
      'entre dois homens': '👬',
      'tem barba' : '🧔',
      'com cabelo curto': '👨‍🦲',
      'com cabelo longo': '👨‍🦱'
    };
  const friendlyCompositionMessage = (card: TradingCard, addBreakingLine :boolean = true) => {
    const compositions = card.compositions;
    if (!compositions) return '';
  
  
    const messages: string[] = [];
    for (const [key, values] of Object.entries(compositions)) {
      const emoji = emojiMap[values[0].toLowerCase()] || '';
      messages.push(`${emoji} ${values.join(', ')}`);
    }
  
    return `${messages.join(addBreakingLine ? '<br/>': ' -')}`; // Use HTML line breaks
  };

  const compositionDescription = (description: string) => {
    // trim
    description = description.trim();
    const emoji = emojiMap[description.toLowerCase()] || '';
    return `${emoji + ' '}${description}`;
  }

  return {
    friendlyCompositionMessage, compositionDescription
  }
}