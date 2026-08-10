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
import { showZoneTravel } from '../ui/screens/ZoneTravelScreen';
import { salvar } from '../systems/save/SaveManager';

const PLAYER_SPEED = 160;
const CHUNK_SIZE = 480;
const TREES_PER_CHUNK = [3, 7] as const;
const ENEMY_CHANCE_PER_CHUNK = 0.5;

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

  private worldW = 0;
  private worldH = 0;
  private zoneId = '';
  private generatedChunks = new Set<string>();
  private lastChunkKey = '';

  constructor() {
    super('MapScene');
  }

  create(): void {
    const player = getPlayer();
    const zone = getZone(player.zonaAtual);
    const raca = getRace(player.racaId);

    this.inCombatTransition = false;
    this.zoneId = zone.id;
    this.generatedChunks = new Set();
    this.lastChunkKey = '';

    // Fases mais avançadas têm mundos fisicamente maiores, revelados aos poucos por blocos.
    this.worldW = 2400 + (zone.ordem - 1) * 320;
    this.worldH = 1700 + (zone.ordem - 1) * 220;
    this.physics.world.setBounds(0, 0, this.worldW, this.worldH);

    const bg = this.add.tileSprite(0, 0, this.worldW, this.worldH, 'tiles', 48).setOrigin(0, 0);
    bg.setTint(zone.corAmbiente);

    this.trees = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();

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
    this.physics.add.collider(this.enemies, this.trees);
    this.physics.add.overlap(this.player, this.enemies, (_player, enemySprite) => {
      this.startCombat(enemySprite as Phaser.Physics.Arcade.Sprite);
    });

    // Revela o entorno do jogador assim que a fase carrega.
    this.ensureChunksAround(player.x, player.y);

    // Camera
    this.cameras.main.setBounds(0, 0, this.worldW, this.worldH);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setBackgroundColor('#0d0a12');

    // Input + HUD
    this.input$ = new InputController(this);
    this.hud = mountHud(
      player,
      this.input$,
      () => this.openCharacterSheet(),
      () => this.openZoneTravel(),
    );

    this.input.keyboard?.on('keydown-E', () => {
      if (this.nearShop) this.openShop();
    });

    this.events.once('shutdown', () => {
      this.hud.unmount();
    });

    salvar(player);
  }

  /** Gera o conteúdo (árvores/inimigos) dos blocos 3x3 ao redor de (px, py), se ainda não gerados. */
  private ensureChunksAround(px: number, py: number): void {
    const cx0 = Math.floor(px / CHUNK_SIZE);
    const cy0 = Math.floor(py / CHUNK_SIZE);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        this.ensureChunk(cx0 + dx, cy0 + dy);
      }
    }
  }

  private ensureChunk(cx: number, cy: number): void {
    const key = `${cx},${cy}`;
    if (this.generatedChunks.has(key)) return;
    this.generatedChunks.add(key);

    const chunkX0 = cx * CHUNK_SIZE;
    const chunkY0 = cy * CHUNK_SIZE;
    if (chunkX0 + CHUNK_SIZE < 0 || chunkY0 + CHUNK_SIZE < 0 || chunkX0 > this.worldW || chunkY0 > this.worldH) {
      return;
    }

    const rng = new Phaser.Math.RandomDataGenerator([this.zoneId, key]);
    const zone = getZone(this.zoneId);
    const playerX = this.player?.x ?? -9999;
    const playerY = this.player?.y ?? -9999;

    const treeCount = rng.between(TREES_PER_CHUNK[0], TREES_PER_CHUNK[1]);
    for (let i = 0; i < treeCount; i++) {
      const x = Phaser.Math.Clamp(chunkX0 + rng.between(20, CHUNK_SIZE - 20), 20, this.worldW - 20);
      const y = Phaser.Math.Clamp(chunkY0 + rng.between(20, CHUNK_SIZE - 20), 20, this.worldH - 20);
      if (Phaser.Math.Distance.Between(x, y, playerX, playerY) < 110) continue;
      if (Phaser.Math.Distance.Between(x, y, 120, 120) < 90) continue;
      this.drawTree(x, y);
    }

    if (rng.frac() < ENEMY_CHANCE_PER_CHUNK && zone.enemyIds.length > 0) {
      const x = Phaser.Math.Clamp(chunkX0 + rng.between(30, CHUNK_SIZE - 30), 30, this.worldW - 30);
      const y = Phaser.Math.Clamp(chunkY0 + rng.between(30, CHUNK_SIZE - 30), 30, this.worldH - 30);
      if (Phaser.Math.Distance.Between(x, y, playerX, playerY) > 160) {
        this.spawnEnemy(rng.pick(zone.enemyIds), x, y);
      }
    }
  }

  private spawnEnemy(enemyId: string, x: number, y: number): void {
    const enemyDef = getEnemy(enemyId);
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

  private openZoneTravel(): void {
    const player = getPlayer();
    showZoneTravel(
      player,
      () => {},
      (zoneId) => {
        player.zonaAtual = zoneId;
        player.x = 400;
        player.y = 300;
        salvar(player);
        this.scene.start('MapScene');
      },
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

    const chunkKey = `${Math.floor(this.player.x / CHUNK_SIZE)},${Math.floor(this.player.y / CHUNK_SIZE)}`;
    if (chunkKey !== this.lastChunkKey) {
      this.lastChunkKey = chunkKey;
      this.ensureChunksAround(this.player.x, this.player.y);
    }
  }
}
