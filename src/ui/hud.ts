import { el, uiRoot } from './dom';
import type { PlayerData } from '../data/types';
import { getRace } from '../data/races';
import { getEffectiveStats } from '../systems/progression/EquipmentStats';
import { InputController } from '../systems/input/InputController';
import { salvar } from '../systems/save/SaveManager';

export interface HudHandle {
  refresh: () => void;
  unmount: () => void;
}

export function mountHud(
  player: PlayerData,
  input: InputController,
  onAbrirPersonagem: () => void,
): HudHandle {
  const hud = el('div', undefined);
  hud.id = 'hud';

  const nameEl = el('span', 'hud-name', '');
  const hpOuter = el('div', 'hp-bar-outer');
  const hpInner = el('div', 'hp-bar-inner');
  hpOuter.appendChild(hpInner);
  const hpText = el('span', undefined, '');
  const coinsEl = el('span', 'hud-coins', '');

  hud.appendChild(nameEl);
  hud.appendChild(hpOuter);
  hud.appendChild(hpText);
  hud.appendChild(coinsEl);
  hud.appendChild(el('div', 'hud-spacer'));

  const dpad = el('div');
  dpad.id = 'dpad';
  const dirs: { dir: 'up' | 'down' | 'left' | 'right'; cls: string; label: string }[] = [
    { dir: 'up', cls: 'dpad-up', label: '▲' },
    { dir: 'left', cls: 'dpad-left', label: '◀' },
    { dir: 'right', cls: 'dpad-right', label: '▶' },
    { dir: 'down', cls: 'dpad-down', label: '▼' },
  ];
  for (const d of dirs) {
    const btn = el('button', d.cls, d.label);
    const setActive = (active: boolean) => (e: Event) => {
      e.preventDefault();
      input.setTouchDirection(d.dir, active);
    };
    btn.addEventListener('pointerdown', setActive(true));
    btn.addEventListener('pointerup', setActive(false));
    btn.addEventListener('pointerleave', setActive(false));
    btn.addEventListener('pointercancel', setActive(false));
    dpad.appendChild(btn);
  }

  const actions = el('div');
  actions.id = 'action-buttons';
  const charBtn = el('button', 'btn', '👤 Personagem');
  charBtn.addEventListener('click', onAbrirPersonagem);
  const saveBtn = el('button', 'btn', '💾 Salvar');
  saveBtn.addEventListener('click', () => {
    salvar(player);
    saveBtn.textContent = '✅ Salvo!';
    setTimeout(() => (saveBtn.textContent = '💾 Salvar'), 1200);
  });
  actions.appendChild(charBtn);
  actions.appendChild(saveBtn);

  uiRoot().appendChild(hud);
  uiRoot().appendChild(dpad);
  uiRoot().appendChild(actions);

  function refresh(): void {
    const raca = getRace(player.racaId);
    const stats = getEffectiveStats(player);
    nameEl.textContent = `${player.nome} · ${raca.nome} · LV ${player.nivel}`;
    const pct = Math.max(0, Math.min(100, (player.vida / stats.vidaMax) * 100));
    hpInner.style.width = `${pct}%`;
    hpText.textContent = `❤️ ${player.vida}/${stats.vidaMax}`;
    coinsEl.textContent = `💰 ${player.moedas}`;
  }
  refresh();

  function unmount(): void {
    hud.remove();
    dpad.remove();
    actions.remove();
  }

  return { refresh, unmount };
}
