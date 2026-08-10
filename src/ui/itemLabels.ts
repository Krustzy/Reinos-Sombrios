import type { WeaponType, ElementType } from '../data/types';

export const ARMA_LABEL: Record<WeaponType, string> = {
  espada: '🗡️ Espada',
  machado: '🪓 Machado',
  arco: '🏹 Arco',
  cajado: '🔮 Cajado',
  adaga: '🔪 Adaga',
};

export const ELEMENTO_LABEL: Record<ElementType, string> = {
  fogo: '🔥 Fogo',
  gelo: '❄️ Gelo',
  veneno: '☠️ Veneno',
  sombrio: '🌑 Sombrio',
};
