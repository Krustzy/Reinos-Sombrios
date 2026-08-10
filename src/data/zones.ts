import type { ZoneDef } from './types';

export const ZONES: ZoneDef[] = [
  { id: 'floresta-sombria', nome: 'Floresta Sombria', ordem: 1, nivelMinimo: 1, enemyIds: ['goblin', 'esqueleto', 'kobold', 'goblin-rei'], corAmbiente: 0x1c3320 },
  { id: 'pantano-amaldicoado', nome: 'Pântano Amaldiçoado', ordem: 2, nivelMinimo: 4, enemyIds: ['esqueleto', 'limo-corrosivo', 'lobo-gigante', 'kobold', 'limo-ancestral'], corAmbiente: 0x243a24 },
  { id: 'colinas-uivantes', nome: 'Colinas Uivantes', ordem: 3, nivelMinimo: 7, enemyIds: ['lobo-gigante', 'fera-uivante', 'gnoll', 'alfa-da-matilha'], corAmbiente: 0x33402a },
  { id: 'caverna-dos-ecos', nome: 'Caverna dos Ecos', ordem: 4, nivelMinimo: 10, enemyIds: ['aranha-gigante', 'morcego-vampirico', 'fera-uivante', 'harpia', 'aranha-mae'], corAmbiente: 0x2a2a3a },
  { id: 'ruinas-esquecidas', nome: 'Ruínas Esquecidas', ordem: 5, nivelMinimo: 13, enemyIds: ['aranha-gigante', 'morcego-vampirico', 'ork-renegado', 'harpia', 'guardiao-de-pedra'], corAmbiente: 0x3a2f2a },
  { id: 'terras-amaldicoadas', nome: 'Terras Amaldiçoadas', ordem: 6, nivelMinimo: 16, enemyIds: ['ork-renegado', 'espectro-sombrio', 'escorpiao-trevas', 'troll-das-montanhas', 'wraith-anciao'], corAmbiente: 0x3a2438 },
  { id: 'masmorra-dos-ossos', nome: 'Masmorra dos Ossos', ordem: 7, nivelMinimo: 19, enemyIds: ['escorpiao-trevas', 'assassino-encapuzado', 'cavaleiro-sombrio'], corAmbiente: 0x2a2432 },
  { id: 'torres-sombrias', nome: 'Torres Sombrias', ordem: 8, nivelMinimo: 22, enemyIds: ['assassino-encapuzado', 'guarda-sombrio', 'espectro-sombrio', 'troll-das-montanhas', 'minotauro-das-torres'], corAmbiente: 0x241f2e },
  { id: 'portao-do-abismo', nome: 'Portão do Abismo', ordem: 9, nivelMinimo: 26, enemyIds: ['guarda-sombrio', 'cavaleiro-sombrio', 'escorpiao-trevas', 'hidra-do-abismo'], corAmbiente: 0x1e1824 },
  { id: 'castelo-sombrio', nome: 'Castelo Sombrio', ordem: 10, nivelMinimo: 30, enemyIds: ['guarda-sombrio', 'senhor-sombrio'], corAmbiente: 0x140f1a },
];

export function getZone(id: string): ZoneDef {
  const zone = ZONES.find((z) => z.id === id);
  if (!zone) throw new Error(`Zona desconhecida: ${id}`);
  return zone;
}
