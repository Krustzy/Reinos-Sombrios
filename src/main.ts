import Phaser from 'phaser';
import './style.css';
import { BootScene } from './scenes/BootScene';
import { PreloaderScene } from './scenes/PreloaderScene';
import { MapScene } from './scenes/MapScene';
import { CombatScene } from './scenes/CombatScene';
import { showMainMenu } from './ui/screens/MainMenuScreen';
import { showCharacterCreation } from './ui/screens/CharacterCreationScreen';
import { gameState } from './state/GameState';
import { criarNovoPersonagem } from './systems/PlayerFactory';
import { carregar, salvar } from './systems/save/SaveManager';
import { clearScreens } from './ui/dom';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-root',
  width: 480,
  height: 720,
  backgroundColor: '#0d0a12',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [BootScene, PreloaderScene, MapScene, CombatScene],
});

function goToMainMenu(): void {
  showMainMenu({
    onNovoJogo: () => {
      showCharacterCreation({
        onCriado: (nome, racaId) => {
          gameState.player = criarNovoPersonagem(nome, racaId);
          salvar(gameState.player);
          clearScreens();
          game.scene.start('MapScene');
        },
      });
    },
    onCarregarJogo: () => {
      const player = carregar();
      if (!player) return;
      gameState.player = player;
      clearScreens();
      game.scene.start('MapScene');
    },
  });
}

game.events.once('assets-ready', goToMainMenu);
