import type { PlayerData } from '../../data/types';

const SAVE_KEY = 'reinos-sombrios:save:v1:slot1';

interface SaveGame {
  schemaVersion: 1;
  savedAt: string;
  player: PlayerData;
}

export function salvar(player: PlayerData): void {
  const saveGame: SaveGame = { schemaVersion: 1, savedAt: new Date().toISOString(), player };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveGame));
  } catch (err) {
    console.error('Falha ao salvar o jogo:', err);
  }
}

export function carregar(): PlayerData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const saveGame = JSON.parse(raw) as SaveGame;
    return saveGame.player;
  } catch (err) {
    console.error('Falha ao carregar o jogo:', err);
    return null;
  }
}

export function possuiSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

export function apagarSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (err) {
    console.error('Falha ao apagar o save:', err);
  }
}
