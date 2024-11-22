export const dictImages: { [key: string]: string } = {
  'A sua direita': '/right-arrow.gif',
  'A sua esquerda': '/left-arrow.gif',
  'A sua frente': '/up-arrow.gif',
  'Assento': '/office-chair.gif',
  'Homem mais próximo': '/success.gif',
  'Mulher mais próxima': '/lifting.gif',
  'Presente': '/gift.gif',
  'Qualquer homem': '/man.gif',
  'Qualquer mulher': '/woman.gif',
  'Revelar': '/opening.gif',
  'Troca': '/exchange.gif',
}

export const useDeckImages = () => {
  const getImage = (key: any) => {
    return dictImages[key];
  }

  return {
    getImage
  }
}