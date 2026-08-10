import Phaser from 'phaser';
import { getPlayer } from '../state/GameState';
import { getRace } from '../data/races';
import { getZone } from '../data/zones';
import { getEnemy } from '../data/enemies';
import { getEffectiveStats } from '../systems/progression/EquipmentStats';
import { InputController } from '../systems/input/InputController';
import { mountHud, type HudHandle } from '../ui/hud';
import { showShop } from '../ui/screens/ShopScreen';
import { showCharacterSheet } from '../ui/screens/CharacterSheetScreen';
import { salvar } from '../systems/save/SaveManager';

const WORLD_W = 2800;
const WORLD_H = 2000;
const PLAYER_SPEED = 160;
const TREE_COUNT = 110;
const ENEMY_COUNT = 16;

export class MapScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private input$!: InputController;
  private hud!: HudHandle;
  private trees!: Phaser.Physics.Arcade.StaticGroup;
  private enemies!: Phaser.Physics.Arcade.Group;
  private shopZone!: Phaser.GameObjects.Zone;
  private nearShop = false;
  private shopPrompt!: Phaser.GameObjects.Text;
  private inCombatTransition = false;

  constructor() {
    super('MapScene');
  }

  create(): void {
    const player = getPlayer();
    const zone = getZone(player.zonaAtual);
    const raca = getRace(player.racaId);

    this.inCombatTransition = false;
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    const bg = this.add.tileSprite(0, 0, WORLD_W, WORLD_H, 'tiles', 48).setOrigin(0, 0);
    bg.setTint(0x1c3320);

    // Trees (static obstacles)
    this.trees = this.physics.add.staticGroup();
    const rng = new Phaser.Math.RandomDataGenerator([zone.id]);
    for (let i = 0; i < TREE_COUNT; i++) {
      const x = rng.between(40, WORLD_W - 40);
      const y = rng.between(40, WORLD_H - 40);
      if (Phaser.Math.Distance.Between(x, y, player.x, player.y) < 120) continue;
      this.drawTree(x, y);
    }

    // Shop
    const shopX = 120;
    const shopY = 120;
    const shopSprite = this.add.sprite(shopX, shopY, 'tiles', 92).setScale(3);
    this.add.text(shopX, shopY - 28, '🏪 Loja', { fontSize: '13px', color: '#c9a13b' }).setOrigin(0.5);
    shopSprite.setInteractive({ useHandCursor: true });
    shopSprite.on('pointerdown', () => this.openShop());
    this.shopZone = this.add.zone(shopX, shopY, 48, 48);
    this.physics.add.existing(this.shopZone, true);
    this.shopPrompt = this.add
      .text(shopX, shopY + 30, 'Toque na loja ou pressione E', { fontSize: '11px', color: '#a294bd' })
      .setOrigin(0.5)
      .setVisible(false);

    // Player
    this.player = this.physics.add.sprite(player.x, player.y, 'tiles', raca.spriteFrame);
    this.player.setTint(raca.tint);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(2.2);
    this.player.setBodySize(10, 12);
    this.player.setDepth(10);

    this.physics.add.collider(this.player, this.trees);
    this.physics.add.overlap(this.player, this.shopZone, () => {
      this.nearShop = true;
    });

    // Enemies
    this.enemies = this.physics.add.group();
    for (let i = 0; i < ENEMY_COUNT; i++) {
      const enemyId = Phaser.Utils.Array.GetRandom(zone.enemyIds);
      const enemyDef = getEnemy(enemyId);
      let x = 0;
      let y = 0;
      let tries = 0;
      do {
        x = Phaser.Math.Between(60, WORLD_W - 60);
        y = Phaser.Math.Between(60, WORLD_H - 60);
        tries++;
      } while (Phaser.Math.Distance.Between(x, y, player.x, player.y) < 200 && tries < 20);

      const sprite = this.physics.add.sprite(x, y, 'tiles', enemyDef.spriteFrame);
      sprite.setTint(enemyDef.tint);
      sprite.setScale(2);
      sprite.setData('enemyId', enemyId);
      sprite.setBounce(1);
      sprite.setCollideWorldBounds(true);
      this.pickNewWanderVelocity(sprite);
      this.time.addEvent({
        delay: Phaser.Math.Between(1800, 3200),
        loop: true,
        callback: () => this.pickNewWanderVelocity(sprite),
      });
      this.enemies.add(sprite);
    }

    this.physics.add.collider(this.enemies, this.trees);
    this.physics.add.overlap(this.player, this.enemies, (_player, enemySprite) => {
      this.startCombat(enemySprite as Phaser.Physics.Arcade.Sprite);
    });

    // Camera
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setBackgroundColor('#0d0a12');

    // Input + HUD
    this.input$ = new InputController(this);
    this.hud = mountHud(player, this.input$, () => this.openCharacterSheet());

    this.input.keyboard?.on('keydown-E', () => {
      if (this.nearShop) this.openShop();
    });

    this.events.once('shutdown', () => {
      this.hud.unmount();
    });

    salvar(player);
  }

  private drawTree(x: number, y: number): void {
    this.add.rectangle(x, y + 10, 8, 14, 0x3a2a1a);
    const canopy = this.add.circle(x, y - 6, 16, 0x152615).setStrokeStyle(2, 0x0d1a0d);
    const obstacle = this.trees.create(x, y, undefined) as Phaser.Physics.Arcade.Sprite;
    obstacle.setVisible(false);
    obstacle.body?.setSize(20, 20);
    canopy.setDepth(5);
  }

  private pickNewWanderVelocity(sprite: Phaser.Physics.Arcade.Sprite): void {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const speed = Phaser.Math.Between(20, 45);
    sprite.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  private openShop(): void {
    const player = getPlayer();
    showShop(
      player,
      () => {},
      () => this.hud.refresh(),
    );
  }

  private openCharacterSheet(): void {
    const player = getPlayer();
    showCharacterSheet(
      player,
      () => {},
      () => this.hud.refresh(),
    );
  }

  private startCombat(enemySprite: Phaser.Physics.Arcade.Sprite): void {
    if (this.inCombatTransition) return;
    this.inCombatTransition = true;
    const enemyId = enemySprite.getData('enemyId') as string;
    const player = getPlayer();
    player.x = this.player.x;
    player.y = this.player.y;
    salvar(player);
    this.scene.start('CombatScene', { enemyId });
  }

  update(): void {
    if (this.inCombatTransition) return;
    this.nearShop = this.shopZone && this.player
      ? Phaser.Math.Distance.Between(this.player.x, this.player.y, this.shopZone.x, this.shopZone.y) < 60
      : false;
    this.shopPrompt.setVisible(this.nearShop);

    const player = getPlayer();
    const stats = getEffectiveStats(player);
    const dir = this.input$.getDirection();
    let vx = 0;
    let vy = 0;
    if (dir.left) vx -= 1;
    if (dir.right) vx += 1;
    if (dir.up) vy -= 1;
    if (dir.down) vy += 1;

    const len = Math.hypot(vx, vy) || 1;
    const speed = PLAYER_SPEED + stats.agilidade * 2;
    this.player.setVelocity((vx / len) * speed, (vy / len) * speed);

    if (vx < 0) this.player.setFlipX(true);
    else if (vx > 0) this.player.setFlipX(false);

    player.x = Math.round(this.player.x);
    player.y = Math.round(this.player.y);
  }
}
