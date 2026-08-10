import { el, uiRoot } from '../dom';
import type { PlayerData } from '../../data/types';
import { getRace } from '../../data/races';
import { getItem } from '../../data/items';
import { getEffectiveStats } from '../../systems/progression/EquipmentStats';
import { xpParaProximoNivel } from '../../systems/progression/LevelSystem';
import { usarConsumivel } from '../../systems/inventory/InventorySystem';
import { applyFrameToImg } from '../../utils/spriteRender';
import { salvar } from '../../systems/save/SaveManager';
import { ARMA_LABEL, ELEMENTO_LABEL } from '../itemLabels';

function descreverArma(armaId: string | null): string {
  if (!armaId) return '—';
  const arma = getItem(armaId);
  const partes = [arma.nome];
  if (arma.tipoArma) partes.push(`(${ARMA_LABEL[arma.tipoArma]}${arma.elemento ? ` · ${ELEMENTO_LABEL[arma.elemento]}` : ''})`);
  return partes.join(' ');
}

export function showCharacterSheet(player: PlayerData, onClose: () => void, onChange: () => void): void {
  const backdrop = el('div', 'modal-backdrop');
  const modal = el('div', 'modal');

  const closeBtn = el('button', 'btn modal-close', '✕');
  closeBtn.addEventListener('click', () => {
    backdrop.remove();
    onClose();
  });
  modal.appendChild(closeBtn);
  modal.appendChild(el('h2', undefined, '👤 Personagem'));

  const raca = getRace(player.racaId);
  const stats = getEffectiveStats(player);

  const statList = el('div', 'stat-list');
  const rows: [string, string][] = [
    ['Nome', player.nome],
    ['Raça', raca.nome],
    ['Nível', String(player.nivel)],
    ['XP', `${player.xp} / ${xpParaProximoNivel(player.nivel)}`],
    ['Vida', `${player.vida} / ${stats.vidaMax}`],
    ['Força', String(stats.forca)],
    ['Magia', String(stats.magia)],
    ['Agilidade', String(stats.agilidade)],
    ['Moedas', `💰 ${player.moedas}`],
    ['Fragmentos Sombrios', `🔮 ${player.fragmentosSombrios}`],
    ['Arma', descreverArma(player.armaId)],
    ['Armadura', player.armaduraId ? getItem(player.armaduraId).nome : '—'],
  ];
  for (const [label, value] of rows) {
    statList.appendChild(el('div', undefined, `<span>${label}:</span> ${value}`));
  }
  modal.appendChild(statList);

  modal.appendChild(el('h2', undefined, '🎒 Inventário'));
  const invList = el('div');
  modal.appendChild(invList);

  function refreshInventory(): void {
    invList.innerHTML = '';
    if (player.inventario.length === 0) {
      invList.appendChild(el('p', undefined, 'Vazio.'));
      return;
    }
    for (const entry of player.inventario) {
      const item = getItem(entry.itemId);
      const row = el('div', 'item-row');

      const sprite = document.createElement('img');
      sprite.className = 'item-sprite';
      applyFrameToImg(sprite, item.spriteFrame, item.tint);
      row.appendChild(sprite);

      const info = el('div', 'item-info');
      info.appendChild(el('div', 'item-name', `${item.nome} x${entry.quantidade}`));
      row.appendChild(info);

      if (item.tipo === 'consumivel') {
        const useBtn = el('button', 'btn', 'Usar');
        useBtn.addEventListener('click', () => {
          usarConsumivel(player, item.id);
          salvar(player);
          onChange();
          refreshInventory();
        });
        row.appendChild(useBtn);
      }

      invList.appendChild(row);
    }
  }
  refreshInventory();

  backdrop.appendChild(modal);
  uiRoot().appendChild(backdrop);
}
