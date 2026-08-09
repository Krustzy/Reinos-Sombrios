import type { PlayerData } from '../data/types';

interface GameState {
  player: PlayerData | null;
}

export const gameState: GameState = { player: null };

export function getPlayer(): PlayerData {
  if (!gameState.player) throw new Error('Nenhum personagem carregado.');
  return gameState.player;
}
