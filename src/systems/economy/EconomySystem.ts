import type { PlayerData } from '../../data/types';
import { getItem } from '../../data/items';
import { addItem, removeItem } from '../inventory/InventorySystem';

export type BuyResult = { sucesso: true } | { sucesso: false; motivo: string };

export function comprarItem(player: PlayerData, itemId: string): BuyResult {
  const item = getItem(itemId);
  if (player.moedas < item.precoMoedas) {
    return { sucesso: false, motivo: 'Moedas insuficientes.' };
  }

  player.moedas -= item.precoMoedas;

  if (item.slot === 'arma') {
    player.armaId = item.id;
  } else if (item.slot === 'armadura') {
    player.armaduraId = item.id;
  } else {
    addItem(player, item.id, 1);
  }

  return { sucesso: true };
}

export type SellResult = { sucesso: true; moedasRecebidas: number } | { sucesso: false; motivo: string };

export function venderItem(player: PlayerData, itemId: string): SellResult {
  const item = getItem(itemId);
  if (!removeItem(player, itemId, 1)) {
    return { sucesso: false, motivo: 'Você não possui esse item.' };
  }
  player.moedas += item.vendaMoedas;
  return { sucesso: true, moedasRecebidas: item.vendaMoedas };
}
