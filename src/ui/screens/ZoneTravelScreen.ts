import { el, uiRoot } from '../dom';
import { ZONES } from '../../data/zones';
import type { PlayerData } from '../../data/types';

export function showZoneTravel(player: PlayerData, onClose: () => void, onTravel: (zoneId: string) => void): void {
  const backdrop = el('div', 'modal-backdrop');
  const modal = el('div', 'modal');

  const closeBtn = el('button', 'btn modal-close', '✕');
  closeBtn.addEventListener('click', () => {
    backdrop.remove();
    onClose();
  });
  modal.appendChild(closeBtn);
  modal.appendChild(el('h2', undefined, '🗺️ Reinos Sombrios'));
  modal.appendChild(el('p', undefined, `Nível atual: ${player.nivel}`));

  const list = el('div');
  modal.appendChild(list);

  const zonasOrdenadas = [...ZONES].sort((a, b) => a.ordem - b.ordem);
  for (const zone of zonasOrdenadas) {
    const desbloqueada = player.nivel >= zone.nivelMinimo;
    const row = el('div', 'item-row');

    const info = el('div', 'item-info');
    const atual = player.zonaAtual === zone.id ? ' (aqui)' : '';
    info.appendChild(el('div', 'item-name', `${zone.ordem}. ${zone.nome}${atual}`));
    info.appendChild(
      el(
        'div',
        'item-desc',
        desbloqueada ? `Nível recomendado: ${zone.nivelMinimo}` : `🔒 Requer nível ${zone.nivelMinimo}`,
      ),
    );
    row.appendChild(info);

    const goBtn = el('button', 'btn', player.zonaAtual === zone.id ? 'Aqui' : 'Viajar');
    goBtn.disabled = !desbloqueada || player.zonaAtual === zone.id;
    goBtn.addEventListener('click', () => {
      backdrop.remove();
      onTravel(zone.id);
    });
    row.appendChild(goBtn);

    list.appendChild(row);
  }

  backdrop.appendChild(modal);
  uiRoot().appendChild(backdrop);
}
