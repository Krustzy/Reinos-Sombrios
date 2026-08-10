import { el, uiRoot } from '../dom';
import { ENEMIES } from '../../data/enemies';
import type { PlayerData } from '../../data/types';
import { applyFrameToImg } from '../../utils/spriteRender';

const TIER_LABEL: Record<string, string> = {
  comum: 'Comum',
  elite: 'Elite',
  boss: '💀 Chefe',
};

export function showBestiary(player: PlayerData, onClose: () => void): void {
  const backdrop = el('div', 'modal-backdrop');
  const modal = el('div', 'modal');

  const closeBtn = el('button', 'btn modal-close', '✕');
  closeBtn.addEventListener('click', () => {
    backdrop.remove();
    onClose();
  });
  modal.appendChild(closeBtn);
  modal.appendChild(el('h2', undefined, '📖 Bestiário'));
  modal.appendChild(
    el('p', undefined, `${player.inimigosDescobertos.length} / ${ENEMIES.length} inimigos descobertos`),
  );

  const list = el('div');
  modal.appendChild(list);

  for (const enemy of ENEMIES) {
    const descoberto = player.inimigosDescobertos.includes(enemy.id);
    const row = el('div', 'item-row');

    if (descoberto) {
      const sprite = document.createElement('img');
      sprite.className = 'item-sprite';
      applyFrameToImg(sprite, enemy.spriteFrame, enemy.tint);
      row.appendChild(sprite);
    } else {
      row.appendChild(el('div', 'item-sprite', '❓'));
    }

    const info = el('div', 'item-info');
    if (descoberto) {
      info.appendChild(el('div', 'item-name', enemy.nome));
      info.appendChild(
        el(
          'div',
          'item-desc',
          `${TIER_LABEL[enemy.tier]} · ❤️ ${enemy.vida} · ⚔ ${enemy.ataque} · ✨ ${enemy.xp} XP · 💰 ${enemy.moedas}`,
        ),
      );
    } else {
      info.appendChild(el('div', 'item-name', '???'));
      info.appendChild(el('div', 'item-desc', 'Ainda não derrotado.'));
    }
    row.appendChild(info);

    list.appendChild(row);
  }

  backdrop.appendChild(modal);
  uiRoot().appendChild(backdrop);
}
