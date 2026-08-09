import type { PlayerData } from '../../data/types';
import { getItem } from '../../data/items';

export function addItem(player: PlayerData, itemId: string, quantidade = 1): void {
  const entry = player.inventario.find((e) => e.itemId === itemId);
  if (entry) {
    entry.quantidade += quantidade;
  } else {
    player.inventario.push({ itemId, quantidade });
  }
}

export function removeItem(player: PlayerData, itemId: string, quantidade = 1): boolean {
  const entry = player.inventario.find((e) => e.itemId === itemId);
  if (!entry || entry.quantidade < quantidade) return false;
  entry.quantidade -= quantidade;
  if (entry.quantidade <= 0) {
    player.inventario = player.inventario.filter((e) => e.itemId !== itemId);
  }
  return true;
}

export interface UseItemResult {
  sucesso: boolean;
  curaAplicada: number;
}

export function usarConsumivel(player: PlayerData, itemId: string): UseItemResult {
  const item = getItem(itemId);
  if (item.tipo !== 'consumivel') return { sucesso: false, curaAplicada: 0 };
  if (!removeItem(player, itemId, 1)) return { sucesso: false, curaAplicada: 0 };

  const cura = item.efeitos.curaHp ?? 0;
  const vidaAnterior = player.vida;
  player.vida = Math.min(player.vida + cura, player.vidaMax);
  return { sucesso: true, curaAplicada: player.vida - vidaAnterior };
}
