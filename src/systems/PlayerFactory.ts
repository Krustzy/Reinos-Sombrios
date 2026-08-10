import type { PlayerData } from '../data/types';
import { getRace } from '../data/races';

export function criarNovoPersonagem(nome: string, racaId: string): PlayerData {
  const raca = getRace(racaId);
  return {
    nome,
    racaId,
    vida: raca.vidaBase,
    vidaMax: raca.vidaBase,
    forca: raca.forcaBase,
    magia: raca.magiaBase,
    agilidade: raca.agilidadeBase,
    nivel: 1,
    xp: 0,
    moedas: 200,
    fragmentosSombrios: 0,
    inventario: [{ itemId: 'pocao-vida', quantidade: 2 }],
    armaId: null,
    armaduraId: null,
    zonaAtual: 'floresta-sombria',
    x: 400,
    y: 300,
    inimigosDescobertos: [],
  };
}
