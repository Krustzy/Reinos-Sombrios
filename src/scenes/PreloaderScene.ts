import Phaser from 'phaser';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  preload(): void {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, 220, 16, 0x221830).setStrokeStyle(1, 0x4a2b6b);
    const barFill = this.add.rectangle(width / 2 - 108, height / 2, 4, 12, 0xc9a13b).setOrigin(0, 0.5);
    this.add
      .text(width / 2, height / 2 - 24, 'Reinos Sombrios', { fontSize: '18px', color: '#c9a13b' })
      .setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      barFill.width = 216 * value;
    });

    this.load.spritesheet('tiles', 'assets/sprites/tiny-dungeon.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create(): void {
    this.game.events.emit('assets-ready');
  }
}
