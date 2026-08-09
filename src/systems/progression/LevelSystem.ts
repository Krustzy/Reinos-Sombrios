import type { PlayerData } from '../../data/types';

export function xpParaProximoNivel(nivel: number): number {
  return nivel * 100;
}

export interface LevelUpResult {
  niveisGanhos: number;
  novoNivel: number;
}

export function ganharXp(player: PlayerData, quantidade: number): LevelUpResult {
  player.xp += quantidade;
  let niveisGanhos = 0;

  while (player.xp >= xpParaProximoNivel(player.nivel)) {
    player.xp -= xpParaProximoNivel(player.nivel);
    player.nivel += 1;
    player.vidaMax += 20;
    player.forca += 3;
    player.magia += 2;
    player.agilidade += 2;
    player.vida = player.vidaMax;
    niveisGanhos += 1;
  }

  return { niveisGanhos, novoNivel: player.nivel };
}
