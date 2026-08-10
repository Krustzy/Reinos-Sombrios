import type { WeaponType } from '../../data/types';
import type { EffectiveStats } from '../progression/EquipmentStats';

function randomVariance(base: number, varianceRatio: number): number {
  const variance = base * varianceRatio;
  const roll = base + (Math.random() * variance * 2 - variance);
  return Math.max(1, Math.round(roll));
}

export function computeAttackDamage(forca: number): number {
  return randomVariance(forca, 0.35);
}

export function computeMagicDamage(magia: number): number {
  return randomVariance(magia * 1.3, 0.4);
}

export function computeEnemyDamage(ataque: number): number {
  return randomVariance(ataque, 0.35);
}

export interface GolpeResultado {
  dano: number;
  critico?: boolean;
  golpeDuplo?: boolean;
}

/** Dano de "Atacar", variando por tipo de arma equipada (espada é o padrão sem arma). */
export function computeWeaponAttack(tipoArma: WeaponType | undefined, stats: EffectiveStats): GolpeResultado[] {
  switch (tipoArma) {
    case 'machado':
      return [{ dano: randomVariance(stats.forca * 1.35, 0.5) }];

    case 'arco': {
      const critico = Math.random() < 0.25;
      const base = randomVariance(stats.agilidade * 1.15, 0.3);
      return [{ dano: critico ? Math.round(base * 1.6) : base, critico }];
    }

    case 'adaga': {
      const golpe1 = randomVariance(stats.forca * 0.65, 0.3);
      const resultados: GolpeResultado[] = [{ dano: golpe1 }];
      if (Math.random() < 0.35) {
        resultados.push({ dano: randomVariance(stats.forca * 0.65, 0.3), golpeDuplo: true });
      }
      return resultados;
    }

    case 'espada':
    default:
      return [{ dano: computeAttackDamage(stats.forca) }];
  }
}

/** Dano de "Magia", ampliado por cajados. */
export function computeWeaponMagic(tipoArma: WeaponType | undefined, stats: EffectiveStats): number {
  if (tipoArma === 'cajado') {
    return randomVariance(stats.magia * 1.6, 0.4);
  }
  return computeMagicDamage(stats.magia);
}

export function computeFleeChance(agilidade: number): number {
  return Math.min(95, agilidade * 3);
}

export function rollFlee(agilidade: number): boolean {
  return Math.random() * 100 < computeFleeChance(agilidade);
}

export function computeCoinDrop(moedasBase: number, variancia: number): number {
  const delta = Math.round((Math.random() * 2 - 1) * variancia);
  return Math.max(0, moedasBase + delta);
}
