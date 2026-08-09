import type { PlayerData } from '../../data/types';
import { getItem } from '../../data/items';

export interface EffectiveStats {
  forca: number;
  magia: number;
  agilidade: number;
  vidaMax: number;
}

export function getEffectiveStats(player: PlayerData): EffectiveStats {
  const stats: EffectiveStats = {
    forca: player.forca,
    magia: player.magia,
    agilidade: player.agilidade,
    vidaMax: player.vidaMax,
  };

  for (const equippedId of [player.armaId, player.armaduraId]) {
    if (!equippedId) continue;
    const item = getItem(equippedId);
    stats.forca += item.efeitos.bonusForca ?? 0;
    stats.magia += item.efeitos.bonusMagia ?? 0;
    stats.vidaMax += item.efeitos.bonusVidaMax ?? 0;
  }

  return stats;
}
