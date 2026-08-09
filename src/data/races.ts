import type { RaceDef } from './types';

export const RACES: RaceDef[] = [
  { id: 'humano', nome: 'Humano', vidaBase: 100, forcaBase: 10, magiaBase: 8, agilidadeBase: 10, spriteFrame: 98, tint: 0xffffff },
  { id: 'ork', nome: 'Ork', vidaBase: 140, forcaBase: 16, magiaBase: 3, agilidadeBase: 6, spriteFrame: 109, tint: 0x7fae52 },
  { id: 'elfo', nome: 'Elfo', vidaBase: 90, forcaBase: 8, magiaBase: 15, agilidadeBase: 14, spriteFrame: 99, tint: 0xbdf5d1 },
  { id: 'vampiro', nome: 'Vampiro', vidaBase: 110, forcaBase: 14, magiaBase: 16, agilidadeBase: 15, spriteFrame: 84, tint: 0xd98fc9 },
  { id: 'lobisomem', nome: 'Lobisomem', vidaBase: 150, forcaBase: 18, magiaBase: 4, agilidadeBase: 12, spriteFrame: 111, tint: 0x9c7a4a },
];

export function getRace(id: string): RaceDef {
  const race = RACES.find((r) => r.id === id);
  if (!race) throw new Error(`Raça desconhecida: ${id}`);
  return race;
}
