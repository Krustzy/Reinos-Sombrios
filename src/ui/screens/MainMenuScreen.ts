import { el, uiRoot, clearScreens } from '../dom';
import { possuiSave } from '../../systems/save/SaveManager';

export interface MainMenuCallbacks {
  onNovoJogo: () => void;
  onCarregarJogo: () => void;
}

export function showMainMenu(callbacks: MainMenuCallbacks): void {
  clearScreens();

  const screen = el('div', 'screen');
  screen.appendChild(el('h1', 'title', 'REINOS SOMBRIOS'));
  screen.appendChild(el('p', 'subtitle', 'RPG de fantasia sombria'));

  const row = el('div', 'btn-row');

  const novoBtn = el('button', 'btn btn-primary', '⚔ NOVO JOGO');
  novoBtn.addEventListener('click', callbacks.onNovoJogo);
  row.appendChild(novoBtn);

  const carregarBtn = el('button', 'btn', '💾 CARREGAR JOGO');
  carregarBtn.disabled = !possuiSave();
  carregarBtn.addEventListener('click', callbacks.onCarregarJogo);
  row.appendChild(carregarBtn);

  screen.appendChild(row);
  uiRoot().appendChild(screen);
}
