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

  // Armas
  {
    id: 'espada-ferro', nome: 'Espada de Ferro', tipo: 'arma', raridade: 'comum',
    precoMoedas: 150, vendaMoedas: 60, spriteFrame: 104, tint: 0xffffff,
    efeitos: { bonusForca: 8 }, slot: 'arma', tipoArma: 'espada',
  },
  {
    id: 'espada-flamejante', nome: 'Espada Flamejante', tipo: 'arma', raridade: 'raro',
    precoMoedas: 400, vendaMoedas: 160, spriteFrame: 107, tint: 0xff8040,
    efeitos: { bonusForca: 18, bonusMagia: 5 }, slot: 'arma', tipoArma: 'espada', elemento: 'fogo',
  },
  {
    id: 'machado-guerra', nome: 'Machado de Guerra', tipo: 'arma', raridade: 'comum',
    precoMoedas: 220, vendaMoedas: 85, spriteFrame: 118, tint: 0xc7ccd4,
    efeitos: { bonusForca: 14 }, slot: 'arma', tipoArma: 'machado',
  },
  {
    id: 'machado-brasa', nome: 'Machado da Brasa', tipo: 'arma', raridade: 'raro',
    precoMoedas: 500, vendaMoedas: 200, spriteFrame: 118, tint: 0xd4592f,
    efeitos: { bonusForca: 22 }, slot: 'arma', tipoArma: 'machado', elemento: 'fogo',
  },
  {
    id: 'arco-cacador', nome: 'Arco do Caçador', tipo: 'arma', raridade: 'comum',
    precoMoedas: 260, vendaMoedas: 100, spriteFrame: 131, tint: 0x8a6a3c,
    efeitos: { bonusAgilidade: 10 }, slot: 'arma', tipoArma: 'arco',
  },
  {
    id: 'cajado-arcano', nome: 'Cajado Arcano', tipo: 'arma', raridade: 'comum',
    precoMoedas: 280, vendaMoedas: 110, spriteFrame: 129, tint: 0xb08fe0,
    efeitos: { bonusMagia: 14 }, slot: 'arma', tipoArma: 'cajado',
  },
  {
    id: 'cajado-gelo', nome: 'Cajado do Gelo Eterno', tipo: 'arma', raridade: 'epico',
    precoMoedas: 550, vendaMoedas: 220, spriteFrame: 129, tint: 0x7fc9e0,
    efeitos: { bonusMagia: 24 }, slot: 'arma', tipoArma: 'cajado', elemento: 'gelo',
  },
  {
    id: 'adaga-sombria', nome: 'Adaga Sombria', tipo: 'arma', raridade: 'raro',
    precoMoedas: 240, vendaMoedas: 95, spriteFrame: 103, tint: 0x5a3d78,
    efeitos: { bonusForca: 6, bonusAgilidade: 8 }, slot: 'arma', tipoArma: 'adaga', elemento: 'sombrio',
  },

  // Armaduras
  {
    id: 'armadura-ferro', nome: 'Armadura de Ferro', tipo: 'armadura', raridade: 'comum',
    precoMoedas: 250, vendaMoedas: 90, spriteFrame: 102, tint: 0xaab4c2,
    efeitos: { bonusVidaMax: 40, bonusDefesa: 5 }, slot: 'armadura',
  },
  {
    id: 'armadura-dragao', nome: 'Armadura do Dragão', tipo: 'armadura', raridade: 'epico',
    precoMoedas: 700, vendaMoedas: 280, spriteFrame: 102, tint: 0xc23b2e,
    efeitos: { bonusVidaMax: 100, bonusForca: 10, bonusDefesa: 15 }, slot: 'armadura',
  },
];

export function getItem(id: string): ItemDef {
  const item = ITEMS.find((i) => i.id === id);
  if (!item) throw new Error(`Item desconhecido: ${id}`);
  return item;
}
