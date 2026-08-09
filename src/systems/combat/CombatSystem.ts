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
