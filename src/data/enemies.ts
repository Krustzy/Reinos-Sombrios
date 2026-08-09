import type { EnemyDef } from './types';

export const ENEMIES: EnemyDef[] = [
  { id: 'goblin', nome: 'Goblin', vida: 50, ataque: 8, xp: 40, moedas: 30, moedasVariancia: 8, fragmentosSombrios: 0, spriteFrame: 112, tint: 0xffffff, tier: 'comum' },
  { id: 'esqueleto', nome: 'Esqueleto', vida: 70, ataque: 10, xp: 60, moedas: 50, moedasVariancia: 10, fragmentosSombrios: 0, spriteFrame: 124, tint: 0xe8e8e8, tier: 'comum' },
  { id: 'lobo-gigante', nome: 'Lobo Gigante', vida: 80, ataque: 13, xp: 75, moedas: 70, moedasVariancia: 12, fragmentosSombrios: 0, spriteFrame: 111, tint: 0x7a8a99, tier: 'comum' },
  { id: 'ork-renegado', nome: 'Ork Renegado', vida: 110, ataque: 18, xp: 100, moedas: 100, moedasVariancia: 15, fragmentosSombrios: 1, spriteFrame: 109, tint: 0xb5502f, tier: 'elite' },
  { id: 'cavaleiro-sombrio', nome: 'Cavaleiro Sombrio', vida: 160, ataque: 24, xp: 180, moedas: 180, moedasVariancia: 20, fragmentosSombrios: 5, spriteFrame: 96, tint: 0x4b2b6b, tier: 'boss' },
];

export function getEnemy(id: string): EnemyDef {
  const enemy = ENEMIES.find((e) => e.id === id);
  if (!enemy) throw new Error(`Inimigo desconhecido: ${id}`);
  return enemy;
}
