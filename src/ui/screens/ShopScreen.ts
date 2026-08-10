import { el, uiRoot } from '../dom';
import { ITEMS } from '../../data/items';
import type { PlayerData } from '../../data/types';
import { comprarItem, venderItem } from '../../systems/economy/EconomySystem';
import { applyFrameToImg } from '../../utils/spriteRender';
import { salvar } from '../../systems/save/SaveManager';
import { ARMA_LABEL, ELEMENTO_LABEL } from '../itemLabels';

export function showShop(player: PlayerData, onClose: () => void, onChange: () => void): void {
  const backdrop = el('div', 'modal-backdrop');
  const modal = el('div', 'modal');

  const closeBtn = el('button', 'btn modal-close', '✕');
  closeBtn.addEventListener('click', () => {
    backdrop.remove();
    onClose();
  });
  modal.appendChild(closeBtn);
  modal.appendChild(el('h2', undefined, '🏪 Loja'));

  const coinsLabel = el('p', undefined, '');
  modal.appendChild(coinsLabel);

  const list = el('div');
  modal.appendChild(list);

  function refresh(): void {
    coinsLabel.textContent = `💰 Você tem ${player.moedas} moedas`;
    list.innerHTML = '';

    for (const item of ITEMS) {
      const row = el('div', 'item-row');

      const sprite = document.createElement('img');
      sprite.className = 'item-sprite';
      applyFrameToImg(sprite, item.spriteFrame, item.tint);
      row.appendChild(sprite);

      const info = el('div', 'item-info');
      info.appendChild(el('div', 'item-name', item.nome));
      const efeitos: string[] = [];
      if (item.efeitos.curaHp) efeitos.push(`Cura ${item.efeitos.curaHp} HP`);
      if (item.efeitos.bonusForca) efeitos.push(`+${item.efeitos.bonusForca} Força`);
      if (item.efeitos.bonusMagia) efeitos.push(`+${item.efeitos.bonusMagia} Magia`);
      if (item.efeitos.bonusVidaMax) efeitos.push(`+${item.efeitos.bonusVidaMax} Vida máx.`);
      if (item.efeitos.bonusAgilidade) efeitos.push(`+${item.efeitos.bonusAgilidade} Agilidade`);
      if (item.efeitos.bonusDefesa) efeitos.push(`+${item.efeitos.bonusDefesa} Defesa`);
      const tags: string[] = [];
      if (item.tipoArma) tags.push(ARMA_LABEL[item.tipoArma]);
      if (item.elemento) tags.push(ELEMENTO_LABEL[item.elemento]);
      info.appendChild(
        el(
          'div',
          'item-desc',
          `<span class="rarity-${item.raridade}">${item.raridade}</span>${tags.length ? ' · ' + tags.join(' ') : ''} · ${efeitos.join(', ')} · ${item.precoMoedas} moedas`,
        ),
      );
      row.appendChild(info);

      const buyBtn = el('button', 'btn', 'Comprar');
      buyBtn.disabled = player.moedas < item.precoMoedas;
      buyBtn.addEventListener('click', () => {
        const result = comprarItem(player, item.id);
        if (result.sucesso) {
          salvar(player);
          onChange();
          refresh();
        }
      });
      row.appendChild(buyBtn);

      const inventoryEntry = player.inventario.find((e) => e.itemId === item.id);
      if (inventoryEntry && inventoryEntry.quantidade > 0) {
        const sellBtn = el('button', 'btn', `Vender (${item.vendaMoedas})`);
        sellBtn.addEventListener('click', () => {
          const result = venderItem(player, item.id);
          if (result.sucesso) {
            salvar(player);
            onChange();
            refresh();
          }
        });
        row.appendChild(sellBtn);
      }

      list.appendChild(row);
    }
  }

  refresh();
  backdrop.appendChild(modal);
  uiRoot().appendChild(backdrop);
}
