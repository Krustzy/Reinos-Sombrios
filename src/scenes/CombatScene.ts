import Phaser from 'phaser';
import { getPlayer } from '../state/GameState';
import { getRace } from '../data/races';
import { getEnemy } from '../data/enemies';
import { getEffectiveStats } from '../systems/progression/EquipmentStats';
import { ganharXp } from '../systems/progression/LevelSystem';
import {
  computeAttackDamage,
  computeMagicDamage,
  computeEnemyDamage,
  computeCoinDrop,
  rollFlee,
} from '../systems/combat/CombatSystem';
import { usarConsumivel } from '../systems/inventory/InventorySystem';
import { getItem, ITEMS } from '../data/items';
import { el, uiRoot } from '../ui/dom';
import { salvar } from '../systems/save/SaveManager';

interface CombatInitData {
  enemyId: string;
}

export class CombatScene extends Phaser.Scene {
  private enemyId!: string;
  private enemyHp = 0;
  private enemyHpMax = 0;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private enemySprite!: Phaser.GameObjects.Sprite;
  private panel!: HTMLElement;
  private logEl!: HTMLElement;
  private playerHpInner!: HTMLElement;
  private playerHpText!: HTMLElement;
  private enemyHpInner!: HTMLElement;
  private enemyHpText!: HTMLElement;
  private buttons: HTMLButtonElement[] = [];
  private turnBusy = false;
  private ended = false;

  constructor() {
    super('CombatScene');
  }

  init(data: CombatInitData): void {
    this.enemyId = data.enemyId;
    this.ended = false;
  }

  create(): void {
    const player = getPlayer();
    const raca = getRace(player.racaId);
    const enemyDef = getEnemy(this.enemyId);
    this.enemyHpMax = enemyDef.vida;
    this.enemyHp = enemyDef.vida;

    this.cameras.main.setBackgroundColor('#0d0a12');
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height * 0.62, width, 6, 0x1a1424);

    this.playerSprite = this.add.sprite(width * 0.28, height * 0.55, 'tiles', raca.spriteFrame);
    this.playerSprite.setTint(raca.tint);
    this.playerSprite.setScale(5);

    this.enemySprite = this.add.sprite(width * 0.72, height * 0.5, 'tiles', enemyDef.spriteFrame);
    this.enemySprite.setTint(enemyDef.tint);
    this.enemySprite.setScale(5);
    this.enemySprite.setFlipX(true);

    this.add
      .text(width * 0.72, height * 0.5 - 70, enemyDef.nome, { fontSize: '16px', color: '#e8e0f0' })
      .setOrigin(0.5);

    this.tweens.add({
      targets: this.enemySprite,
      y: this.enemySprite.y - 6,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.buildPanel(player);
    this.events.once('shutdown', () => this.panel.remove());
  }

  private buildPanel(player: ReturnType<typeof getPlayer>): void {
    this.panel = el('div');
    this.panel.id = 'combat-panel';

    const bars = el('div', 'combat-hpbars');

    const playerSide = el('div', 'combat-side');
    playerSide.appendChild(el('div', undefined, player.nome));
    const pOuter = el('div', 'hp-bar-outer');
    this.playerHpInner = el('div', 'hp-bar-inner');
    pOuter.appendChild(this.playerHpInner);
    playerSide.appendChild(pOuter);
    this.playerHpText = el('div', undefined, '');
    playerSide.appendChild(this.playerHpText);

    const enemyDef = getEnemy(this.enemyId);
    const enemySide = el('div', 'combat-side');
    enemySide.appendChild(el('div', undefined, enemyDef.nome));
    const eOuter = el('div', 'hp-bar-outer');
    this.enemyHpInner = el('div', 'hp-bar-inner');
    eOuter.appendChild(this.enemyHpInner);
    enemySide.appendChild(eOuter);
    this.enemyHpText = el('div', undefined, '');
    enemySide.appendChild(this.enemyHpText);

    bars.appendChild(playerSide);
    bars.appendChild(enemySide);
    this.panel.appendChild(bars);

    this.logEl = el('div');
    this.logEl.id = 'combat-log';
    this.panel.appendChild(this.logEl);

    const row = el('div', 'btn-row');
    const atacarBtn = el('button', 'btn btn-primary', '⚔ Atacar');
    atacarBtn.addEventListener('click', () => this.playerTurn('atacar'));
    const magiaBtn = el('button', 'btn', '✨ Magia');
    magiaBtn.addEventListener('click', () => this.playerTurn('magia'));
    const pocaoBtn = el('button', 'btn', '🧪 Poção');
    pocaoBtn.addEventListener('click', () => this.playerTurn('pocao'));
    const fugirBtn = el('button', 'btn', '🏃 Fugir');
    fugirBtn.addEventListener('click', () => this.playerTurn('fugir'));

    this.buttons = [atacarBtn, magiaBtn, pocaoBtn, fugirBtn];
    for (const b of this.buttons) row.appendChild(b);
    this.panel.appendChild(row);

    uiRoot().appendChild(this.panel);

    this.updateBars(player);
    this.log(`Um ${enemyDef.nome} apareceu!`);
  }

  private updateBars(player: ReturnType<typeof getPlayer>): void {
    const stats = getEffectiveStats(player);
    const pPct = Math.max(0, (player.vida / stats.vidaMax) * 100);
    this.playerHpInner.style.width = `${pPct}%`;
    this.playerHpText.textContent = `${Math.max(0, player.vida)}/${stats.vidaMax}`;

    const ePct = Math.max(0, (this.enemyHp / this.enemyHpMax) * 100);
    this.enemyHpInner.style.width = `${ePct}%`;
    this.enemyHpText.textContent = `${Math.max(0, this.enemyHp)}/${this.enemyHpMax}`;
  }

  private log(msg: string): void {
    const line = el('div', undefined, msg);
    this.logEl.appendChild(line);
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }

  private setButtonsEnabled(enabled: boolean): void {
    for (const b of this.buttons) b.disabled = !enabled;
  }

  private lungeSprite(target: Phaser.GameObjects.Sprite, dx: number): void {
    this.tweens.add({
      targets: target,
      x: target.x + dx,
      duration: 90,
      yoyo: true,
      ease: 'Quad.easeOut',
    });
  }

  private flashSprite(target: Phaser.GameObjects.Sprite): void {
    const originalTint = target.tintTopLeft;
    target.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    this.time.delayedCall(80, () => {
      target.setTintMode(Phaser.TintModes.MULTIPLY).setTint(originalTint);
    });
  }

  private playerTurn(acao: 'atacar' | 'magia' | 'pocao' | 'fugir'): void {
    if (this.turnBusy || this.ended) return;
    const player = getPlayer();
    const stats = getEffectiveStats(player);
    const enemyDef = getEnemy(this.enemyId);
    this.turnBusy = true;
    this.setButtonsEnabled(false);

    if (acao === 'fugir') {
      if (rollFlee(stats.agilidade)) {
        this.log('🏃 Você fugiu do combate!');
        this.endCombat('fugiu');
        return;
      }
      this.log('🏃 Você tentou fugir, mas não conseguiu!');
      this.enemyTurn();
      return;
    }

    if (acao === 'pocao') {
      const consumivel = player.inventario
        .map((e) => getItem(e.itemId))
        .find((i) => i.tipo === 'consumivel' && (ITEMS.find((it) => it.id === i.id)?.efeitos.curaHp ?? 0) > 0);
      if (!consumivel) {
        this.log('Você não tem poções.');
        this.turnBusy = false;
        this.setButtonsEnabled(true);
        return;
      }
      const result = usarConsumivel(player, consumivel.id);
      this.log(`🧪 Você usou ${consumivel.nome} e recuperou ${result.curaAplicada} HP.`);
      this.updateBars(player);
      this.enemyTurn();
      return;
    }

    let dano: number;
    if (acao === 'atacar') {
      dano = computeAttackDamage(stats.forca);
      this.log(`⚔ Você atacou e causou ${dano} de dano.`);
    } else {
      dano = computeMagicDamage(stats.magia);
      this.log(`✨ Sua magia causou ${dano} de dano.`);
    }

    this.lungeSprite(this.playerSprite, 20);
    this.flashSprite(this.enemySprite);
    this.enemyHp = Math.max(0, this.enemyHp - dano);
    this.updateBars(player);

    if (this.enemyHp <= 0) {
      this.victory(player, enemyDef);
      return;
    }

    this.enemyTurn();
  }

  private enemyTurn(): void {
    const player = getPlayer();
    const enemyDef = getEnemy(this.enemyId);
    this.time.delayedCall(500, () => {
      const dano = computeEnemyDamage(enemyDef.ataque);
      this.log(`💥 ${enemyDef.nome} atacou e causou ${dano} de dano.`);
      this.lungeSprite(this.enemySprite, -20);
      this.flashSprite(this.playerSprite);
      player.vida = Math.max(0, player.vida - dano);
      this.updateBars(player);

      if (player.vida <= 0) {
        this.defeat(player);
        return;
      }

      this.turnBusy = false;
      this.setButtonsEnabled(true);
    });
  }

  private victory(player: ReturnType<typeof getPlayer>, enemyDef: ReturnType<typeof getEnemy>): void {
    const moedas = computeCoinDrop(enemyDef.moedas, enemyDef.moedasVariancia);
    player.moedas += moedas;
    player.fragmentosSombrios += enemyDef.fragmentosSombrios;
    const { niveisGanhos, novoNivel } = ganharXp(player, enemyDef.xp);

    this.log(`💀 Você derrotou ${enemyDef.nome}! +${enemyDef.xp} XP, +${moedas} moedas.`);
    if (enemyDef.fragmentosSombrios > 0) {
      this.log(`🔮 Você recebeu ${enemyDef.fragmentosSombrios} Fragmentos Sombrios.`);
    }
    if (niveisGanhos > 0) {
      this.log(`⬆️ Você subiu para o nível ${novoNivel}!`);
    }

    this.tweens.add({
      targets: this.enemySprite,
      alpha: 0,
      duration: 300,
    });

    this.endCombat('vitoria');
  }

  private defeat(player: ReturnType<typeof getPlayer>): void {
    this.log('☠ Você foi derrotado e recuou para se recuperar...');
    player.vida = Math.max(1, Math.floor(getEffectiveStats(player).vidaMax * 0.5));
    this.endCombat('derrota');
  }

  private endCombat(_motivo: 'vitoria' | 'derrota' | 'fugiu'): void {
    if (this.ended) return;
    this.ended = true;
    const player = getPlayer();
    salvar(player);
    this.setButtonsEnabled(false);
    this.time.delayedCall(1400, () => {
      this.scene.start('MapScene');
    });
  }
}
