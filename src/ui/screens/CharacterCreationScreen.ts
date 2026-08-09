import { el, uiRoot, clearScreens } from '../dom';
import { RACES } from '../../data/races';
import { applyFrameToImg } from '../../utils/spriteRender';

export interface CharacterCreationCallbacks {
  onCriado: (nome: string, racaId: string) => void;
}

export function showCharacterCreation(callbacks: CharacterCreationCallbacks): void {
  clearScreens();

  const screen = el('div', 'screen');
  screen.appendChild(el('h1', 'title', 'CRIAÇÃO DE PERSONAGEM'));

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Nome do herói';
  nameInput.maxLength = 18;
  screen.appendChild(nameInput);

  let racaSelecionada: string | null = null;
  const grid = el('div', 'race-grid');

  for (const raca of RACES) {
    const card = el('div', 'race-card');
    const sprite = document.createElement('img');
    sprite.className = 'race-sprite';
    applyFrameToImg(sprite, raca.spriteFrame, raca.tint);
    card.appendChild(sprite);
    card.appendChild(el('h3', undefined, raca.nome));
    card.appendChild(
      el(
        'div',
        'stats',
        `❤️ ${raca.vidaBase} · ⚔ ${raca.forcaBase} · ✨ ${raca.magiaBase} · 🏃 ${raca.agilidadeBase}`,
      ),
    );
    card.addEventListener('click', () => {
      racaSelecionada = raca.id;
      grid.querySelectorAll('.race-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
    });
    grid.appendChild(card);
  }
  screen.appendChild(grid);

  const msg = el('p', 'subtitle', '');
  screen.appendChild(msg);

  const confirmBtn = el('button', 'btn btn-primary', '✨ COMEÇAR AVENTURA');
  confirmBtn.addEventListener('click', () => {
    const nome = nameInput.value.trim();
    if (!nome) {
      msg.textContent = 'Digite um nome para o seu herói.';
      return;
    }
    if (!racaSelecionada) {
      msg.textContent = 'Escolha uma raça.';
      return;
    }
    callbacks.onCriado(nome, racaSelecionada);
  });
  screen.appendChild(confirmBtn);

  uiRoot().appendChild(screen);
}
