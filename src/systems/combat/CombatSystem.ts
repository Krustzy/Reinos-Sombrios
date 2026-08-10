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

/** Defesa reduz o dano recebido de forma direta, com piso de 1. */
export function computeEnemyDamage(ataque: number, defesa = 0): number {
  return Math.max(1, randomVariance(ataque, 0.35) - defesa);
}

export function computeCritChance(agilidade: number, bonusArma = 0): number {
  return Math.min(60, agilidade * 0.6 + bonusArma);
}

export function rollCrit(agilidade: number, bonusArma = 0): boolean {
  return Math.random() * 100 < computeCritChance(agilidade, bonusArma);
}

export function computeDodgeChance(agilidade: number): number {
  return Math.min(35, agilidade * 0.45);
}

export function rollDodge(agilidade: number): boolean {
  return Math.random() * 100 < computeDodgeChance(agilidade);
}

export interface GolpeResultado {
  dano: number;
  critico?: boolean;
  golpeDuplo?: boolean;
}

const CRIT_MULTIPLICADOR = 1.6;

/** Dano de "Atacar", variando por tipo de arma equipada (espada é o padrão sem arma). */
export function computeWeaponAttack(tipoArma: WeaponType | undefined, stats: EffectiveStats): GolpeResultado[] {
  const bonusCritArma = tipoArma === 'arco' ? 20 : 0;
  const critico = rollCrit(stats.agilidade, bonusCritArma);
  const mult = critico ? CRIT_MULTIPLICADOR : 1;

  switch (tipoArma) {
    case 'machado':
      return [{ dano: Math.round(randomVariance(stats.forca * 1.35, 0.5) * mult), critico }];

    case 'arco': {
      const base = randomVariance(stats.agilidade * 1.15, 0.3);
      return [{ dano: Math.round(base * mult), critico }];
    }

    case 'adaga': {
      const golpe1 = Math.round(randomVariance(stats.forca * 0.65, 0.3) * mult);
      const resultados: GolpeResultado[] = [{ dano: golpe1, critico }];
      if (Math.random() < 0.35) {
        resultados.push({ dano: Math.round(randomVariance(stats.forca * 0.65, 0.3) * mult), golpeDuplo: true, critico });
      }
      return resultados;
    }

    case 'espada':
    default:
      return [{ dano: Math.round(computeAttackDamage(stats.forca) * mult), critico }];
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
