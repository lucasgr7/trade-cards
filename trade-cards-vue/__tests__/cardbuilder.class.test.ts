

import { describe, it, expect } from 'vitest';
import { CardAssentoBuilder, CardPresenteBuilder } from '../src/util/cardbuilder.class';
import { Card } from '../src/type';
import { CardCompositionEnum } from '../src/enums/cardType';

describe('CardBuilder Test', () => {
  it('should create a Presente card', () => {
    const presente = new CardPresenteBuilder().build();

    // expect the presente to be typed as Card
    expect(presente.name).toBe('Presente');
    expect(presente.type).toBe('object');
    expect(presente.compositions).toBeUndefined();

    console.log(presente);

    // typing
    const isCard: Card = presente;
    expect(isCard).toBeDefined();
  });
  it('should create a Presente card with 1 composition em cor only', () => {
    const presente = new CardPresenteBuilder()
      .addComposition(CardCompositionEnum.ColorVariant).build();

    expect(Object.keys(presente.compositions).length).toBe(1);
    expect(presente.compositions![CardCompositionEnum.ColorVariant]).toBeDefined();
  });
  it('should not allow to create a card without a setted composition enum key', () => {
    //expect to thorw exception
    expect(() => new CardAssentoBuilder().addComposition(CardCompositionEnum.WrappedState).build()).toThrow(Error);
  })
  it('Should create an Presente card with two compositions', () => {
    const presente = new CardPresenteBuilder()
      .addComposition(CardCompositionEnum.ColorVariant)
      .addComposition(CardCompositionEnum.WrappedState)
      .build();
    expect(Object.keys(presente.compositions).length).toBe(2);
  })

})