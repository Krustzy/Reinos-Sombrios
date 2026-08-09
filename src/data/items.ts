import type { ItemDef } from './types';

export const ITEMS: ItemDef[] = [
  {
    id: 'pocao-vida', nome: 'Poção de Vida', tipo: 'consumivel', raridade: 'comum',
    precoMoedas: 50, vendaMoedas: 15, spriteFrame: 115, tint: 0xffffff,
    efeitos: { curaHp: 40 },
  },
  {
    id: 'pocao-grande', nome: 'Poção Grande', tipo: 'consumivel', raridade: 'comum',
    precoMoedas: 100, vendaMoedas: 30, spriteFrame: 127, tint: 0xffffff,
    efeitos: { curaHp: 80 },
  },
  {
    id: 'espada-ferro', nome: 'Espada de Ferro', tipo: 'arma', raridade: 'comum',
    precoMoedas: 150, vendaMoedas: 60, spriteFrame: 104, tint: 0xffffff,
    efeitos: { bonusForca: 8 }, slot: 'arma',
  },
  {
    id: 'espada-flamejante', nome: 'Espada Flamejante', tipo: 'arma', raridade: 'raro',
    precoMoedas: 400, vendaMoedas: 160, spriteFrame: 107, tint: 0xff8040,
    efeitos: { bonusForca: 18, bonusMagia: 5 }, slot: 'arma',
  },
  {
    id: 'armadura-ferro', nome: 'Armadura de Ferro', tipo: 'armadura', raridade: 'comum',
    precoMoedas: 250, vendaMoedas: 90, spriteFrame: 102, tint: 0xaab4c2,
    efeitos: { bonusVidaMax: 40 }, slot: 'armadura',
  },
  {
    id: 'armadura-dragao', nome: 'Armadura do Dragão', tipo: 'armadura', raridade: 'epico',
    precoMoedas: 700, vendaMoedas: 280, spriteFrame: 102, tint: 0xc23b2e,
    efeitos: { bonusVidaMax: 100, bonusForca: 10 }, slot: 'armadura',
  },
];

export function getItem(id: string): ItemDef {
  const item = ITEMS.find((i) => i.id === id);
  if (!item) throw new Error(`Item desconhecido: ${id}`);
  return item;
}
