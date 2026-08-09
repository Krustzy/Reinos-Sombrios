import type { ZoneDef } from './types';

export const ZONES: ZoneDef[] = [
  { id: 'floresta-sombria', nome: 'Floresta Sombria', nivelMinimo: 1, enemyIds: ['goblin', 'esqueleto'] },
];

export function getZone(id: string): ZoneDef {
  const zone = ZONES.find((z) => z.id === id);
  if (!zone) throw new Error(`Zona desconhecida: ${id}`);
  return zone;
}
