import type { EnemyDef } from './types';

export const ENEMIES: EnemyDef[] = [
  // Comuns
  { id: 'goblin', nome: 'Goblin', vida: 50, ataque: 8, xp: 40, moedas: 30, moedasVariancia: 8, fragmentosSombrios: 0, spriteFrame: 112, tint: 0xffffff, tier: 'comum' },
  { id: 'esqueleto', nome: 'Esqueleto', vida: 70, ataque: 10, xp: 60, moedas: 50, moedasVariancia: 10, fragmentosSombrios: 0, spriteFrame: 124, tint: 0xe8e8e8, tier: 'comum' },
  { id: 'limo-corrosivo', nome: 'Limo Corrosivo', vida: 60, ataque: 9, xp: 50, moedas: 40, moedasVariancia: 9, fragmentosSombrios: 0, spriteFrame: 108, tint: 0x6fbf8f, tier: 'comum' },
  { id: 'lobo-gigante', nome: 'Lobo Gigante', vida: 80, ataque: 13, xp: 75, moedas: 70, moedasVariancia: 12, fragmentosSombrios: 0, spriteFrame: 111, tint: 0x7a8a99, tier: 'comum' },
  { id: 'fera-uivante', nome: 'Fera Uivante', vida: 105, ataque: 17, xp: 105, moedas: 95, moedasVariancia: 14, fragmentosSombrios: 0, spriteFrame: 111, tint: 0x3d4a55, tier: 'comum' },
  { id: 'aranha-gigante', nome: 'Aranha Gigante', vida: 95, ataque: 15, xp: 90, moedas: 80, moedasVariancia: 13, fragmentosSombrios: 0, spriteFrame: 122, tint: 0xffffff, tier: 'comum' },
  { id: 'morcego-vampirico', nome: 'Morcego Vampírico', vida: 85, ataque: 14, xp: 85, moedas: 75, moedasVariancia: 13, fragmentosSombrios: 0, spriteFrame: 120, tint: 0x8a5fc9, tier: 'comum' },
  { id: 'kobold', nome: 'Kobold', vida: 55, ataque: 9, xp: 45, moedas: 35, moedasVariancia: 9, fragmentosSombrios: 0, spriteFrame: 112, tint: 0xd4c14a, tier: 'comum' },
  { id: 'gnoll', nome: 'Gnoll', vida: 90, ataque: 15, xp: 95, moedas: 85, moedasVariancia: 13, fragmentosSombrios: 0, spriteFrame: 109, tint: 0xc9a24a, tier: 'comum' },

  // Elites
  { id: 'ork-renegado', nome: 'Ork Renegado', vida: 110, ataque: 18, xp: 100, moedas: 100, moedasVariancia: 15, fragmentosSombrios: 1, spriteFrame: 109, tint: 0xb5502f, tier: 'elite' },
  { id: 'espectro-sombrio', nome: 'Espectro Sombrio', vida: 135, ataque: 21, xp: 140, moedas: 130, moedasVariancia: 16, fragmentosSombrios: 1, spriteFrame: 121, tint: 0x9d8fd9, tier: 'elite' },
  { id: 'escorpiao-trevas', nome: 'Escorpião das Trevas', vida: 145, ataque: 22, xp: 145, moedas: 135, moedasVariancia: 16, fragmentosSombrios: 1, spriteFrame: 110, tint: 0x8b1a2b, tier: 'elite' },
  { id: 'assassino-encapuzado', nome: 'Assassino Encapuzado', vida: 150, ataque: 23, xp: 150, moedas: 140, moedasVariancia: 17, fragmentosSombrios: 1, spriteFrame: 123, tint: 0x2e2e3a, tier: 'elite' },
  { id: 'guarda-sombrio', nome: 'Guarda Sombrio', vida: 190, ataque: 28, xp: 200, moedas: 190, moedasVariancia: 18, fragmentosSombrios: 2, spriteFrame: 97, tint: 0x5a2a3a, tier: 'elite' },
  { id: 'harpia', nome: 'Harpia', vida: 130, ataque: 20, xp: 135, moedas: 125, moedasVariancia: 16, fragmentosSombrios: 1, spriteFrame: 120, tint: 0xd47a3f, tier: 'elite' },
  { id: 'troll-das-montanhas', nome: 'Troll das Montanhas', vida: 210, ataque: 30, xp: 230, moedas: 210, moedasVariancia: 19, fragmentosSombrios: 2, spriteFrame: 109, tint: 0x4a6b3f, tier: 'elite' },

  // Bosses (chefe principal nas fases 7 e 10, mini-chefe nas demais)
  { id: 'goblin-rei', nome: 'Goblin Rei', vida: 90, ataque: 14, xp: 120, moedas: 100, moedasVariancia: 12, fragmentosSombrios: 1, spriteFrame: 112, tint: 0xd4a93c, tier: 'boss' },
  { id: 'limo-ancestral', nome: 'Limo Ancestral', vida: 150, ataque: 17, xp: 180, moedas: 150, moedasVariancia: 14, fragmentosSombrios: 2, spriteFrame: 108, tint: 0x5a3d78, tier: 'boss' },
  { id: 'alfa-da-matilha', nome: 'Alfa da Matilha', vida: 190, ataque: 21, xp: 230, moedas: 190, moedasVariancia: 15, fragmentosSombrios: 2, spriteFrame: 111, tint: 0xd8dce0, tier: 'boss' },
  { id: 'aranha-mae', nome: 'Aranha-Mãe', vida: 230, ataque: 25, xp: 280, moedas: 230, moedasVariancia: 16, fragmentosSombrios: 3, spriteFrame: 122, tint: 0x2b1414, tier: 'boss' },
  { id: 'guardiao-de-pedra', nome: 'Guardião de Pedra', vida: 270, ataque: 27, xp: 330, moedas: 270, moedasVariancia: 17, fragmentosSombrios: 3, spriteFrame: 97, tint: 0x6a6f78, tier: 'boss' },
  { id: 'wraith-anciao', nome: 'Wraith Ancião', vida: 300, ataque: 30, xp: 380, moedas: 310, moedasVariancia: 18, fragmentosSombrios: 4, spriteFrame: 121, tint: 0x1f2b1f, tier: 'boss' },
  { id: 'cavaleiro-sombrio', nome: 'Cavaleiro Sombrio', vida: 160, ataque: 24, xp: 180, moedas: 180, moedasVariancia: 20, fragmentosSombrios: 5, spriteFrame: 96, tint: 0x4b2b6b, tier: 'boss' },
  { id: 'minotauro-das-torres', nome: 'Minotauro das Torres', vida: 340, ataque: 33, xp: 420, moedas: 360, moedasVariancia: 19, fragmentosSombrios: 4, spriteFrame: 111, tint: 0x5a1f1f, tier: 'boss' },
  { id: 'hidra-do-abismo', nome: 'Hidra do Abismo', vida: 360, ataque: 36, xp: 460, moedas: 400, moedasVariancia: 20, fragmentosSombrios: 5, spriteFrame: 122, tint: 0x1f4a45, tier: 'boss' },
  { id: 'senhor-sombrio', nome: 'Senhor Sombrio', vida: 380, ataque: 38, xp: 500, moedas: 450, moedasVariancia: 25, fragmentosSombrios: 15, spriteFrame: 96, tint: 0x1a0d26, tier: 'boss' },
];

export function getEnemy(id: string): EnemyDef {
  const enemy = ENEMIES.find((e) => e.id === id);
  if (!enemy) throw new Error(`Inimigo desconhecido: ${id}`);
  return enemy;
}
