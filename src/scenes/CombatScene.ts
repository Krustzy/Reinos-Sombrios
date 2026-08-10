import Phaser from 'phaser';
import { getPlayer } from '../state/GameState';
import { getRace } from '../data/races';
import { getEnemy } from '../data/enemies';
import { getEffectiveStats } from '../systems/progression/EquipmentStats';
import { ganharXp } from '../systems/progression/LevelSystem';
import {
  computeWeaponAttack,
  computeWeaponMagic,
  computeEnemyDamage,
  computeCoinDrop,
  rollFlee,
  rollDodge,
} from '../systems/combat/CombatSystem';
import { usarConsumivel } from '../systems/inventory/InventorySystem';
import { getItem, ITEMS } from '../data/items';
import type { EnemyTier, ElementType } from '../data/types';
import { el, uiRoot } from '../ui/dom';
import { salvar } from '../systems/save/SaveManager';
import { ELEMENTO_LABEL } from '../ui/itemLabels';

interface EnemyStatus {
  tipo: ElementType;
  turnos: number;
}

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
  private damageFlash!: Phaser.GameObjects.Rectangle;
  private enemyStatus: EnemyStatus | null = null;

  constructor() {
    super('CombatScene');
  }

  init(data: CombatInitData): void {
    this.enemyId = data.enemyId;
    this.ended = false;
    this.turnBusy = false;
    this.enemyStatus = null;
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

    this.damageFlash = this.add.rectangle(width / 2, height / 2, width, height, 0xff0000, 0).setDepth(100);

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

  /** Windup (pull back) + strike (lunge past the old distance) + return, instead of a single small hop. */
  private strikeSprite(target: Phaser.GameObjects.Sprite, dx: number): void {
    const startX = target.x;
    const dir = Math.sign(dx) || 1;
    this.tweens.add({
      targets: target,
      x: startX - dir * 8,
      duration: 70,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: target,
          x: startX + dx,
          duration: 100,
          ease: 'Back.easeIn',
          onComplete: () => {
            this.tweens.add({
              targets: target,
              x: startX,
              duration: 130,
              ease: 'Sine.easeOut',
            });
          },
        });
      },
    });
  }

  private flashSprite(target: Phaser.GameObjects.Sprite): void {
    const originalTint = target.tintTopLeft;
    target.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    this.time.delayedCall(80, () => {
      target.setTintMode(Phaser.TintModes.MULTIPLY).setTint(originalTint);
    });
  }

  /** Short burst of radiating lines at the point of impact. */
  private impactBurst(x: number, y: number, color = 0xf5efe0): void {
    const g = this.add.graphics();
    g.setDepth(60);
    g.lineStyle(2, color, 1);
    const rays = 6;
    for (let i = 0; i < rays; i++) {
      const angle = (Math.PI * 2 * i) / rays + Phaser.Math.FloatBetween(-0.25, 0.25);
      const len = Phaser.Math.Between(10, 20);
      g.lineBetween(x, y, x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    }
    this.tweens.add({
      targets: g,
      alpha: 0,
      scale: 1.7,
      duration: 200,
      ease: 'Quad.easeOut',
      onComplete: () => g.destroy(),
    });
  }

  private shakeForHit(tier: EnemyTier): void {
    if (tier === 'boss') this.cameras.main.shake(220, 0.012);
    else if (tier === 'elite') this.cameras.main.shake(150, 0.008);
    else this.cameras.main.shake(100, 0.005);
  }

  private flashDamageOverlay(): void {
    this.damageFlash.setAlpha(0.28);
    this.tweens.add({ targets: this.damageFlash, alpha: 0, duration: 220, ease: 'Sine.easeOut' });
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

    const arma = player.armaId ? getItem(player.armaId) : null;
    let dano: number;
    if (acao === 'atacar') {
      const golpes = computeWeaponAttack(arma?.tipoArma, stats);
      dano = golpes.reduce((soma, g) => soma + g.dano, 0);
      for (const golpe of golpes) {
        const tag = golpe.critico ? ' (crítico!)' : golpe.golpeDuplo ? ' (2º golpe)' : '';
        this.log(`⚔ Você atacou e causou ${golpe.dano} de dano${tag}.`);
      }
    } else {
      dano = computeWeaponMagic(arma?.tipoArma, stats);
      this.log(`✨ Sua magia causou ${dano} de dano.`);
    }

    if (arma?.elemento && Math.random() < 0.4) {
      this.enemyStatus = { tipo: arma.elemento, turnos: 3 };
      this.log(`${ELEMENTO_LABEL[arma.elemento]} atinge ${enemyDef.nome}!`);
    }

    this.strikeSprite(this.playerSprite, 32);
    this.flashSprite(this.enemySprite);
    this.time.delayedCall(90, () => {
      this.impactBurst(this.enemySprite.x, this.enemySprite.y);
      this.shakeForHit(enemyDef.tier);
    });
    this.enemyHp = Math.max(0, this.enemyHp - dano);
    this.updateBars(player);

    if (this.enemyHp <= 0) {
      this.victory(player, enemyDef);
      return;
    }

    this.enemyTurn();
  }

  private decayEnemyStatus(): void {
    if (!this.enemyStatus) return;
    this.enemyStatus.turnos -= 1;
    if (this.enemyStatus.turnos <= 0) this.enemyStatus = null;
  }

  private sidestepSprite(target: Phaser.GameObjects.Sprite): void {
    const startX = target.x;
    this.tweens.add({ targets: target, x: startX - 14, duration: 90, yoyo: true, ease: 'Sine.easeOut' });
  }

  private enemyTurn(): void {
    const player = getPlayer();
    const stats = getEffectiveStats(player);
    const enemyDef = getEnemy(this.enemyId);
    const isBoss = enemyDef.tier === 'boss';

    const resolve = (): void => {
      if (this.enemyStatus) {
        const { tipo } = this.enemyStatus;
        if (tipo === 'fogo' || tipo === 'veneno') {
          const dot = Math.max(1, Math.round(this.enemyHpMax * 0.06));
          this.enemyHp = Math.max(0, this.enemyHp - dot);
          this.log(`${ELEMENTO_LABEL[tipo]} causa ${dot} de dano contínuo em ${enemyDef.nome}.`);
          this.updateBars(player);
          this.decayEnemyStatus();
          if (this.enemyHp <= 0) {
            this.victory(player, enemyDef);
            return;
          }
        } else if (tipo === 'gelo') {
          this.log(`${ELEMENTO_LABEL[tipo]} congela ${enemyDef.nome}, que perde o turno!`);
          this.decayEnemyStatus();
          this.turnBusy = false;
          this.setButtonsEnabled(true);
          return;
        }
      }

      if (rollDodge(stats.agilidade)) {
        this.log(`🌀 Você esquivou do ataque de ${enemyDef.nome}!`);
        this.sidestepSprite(this.playerSprite);
        this.turnBusy = false;
        this.setButtonsEnabled(true);
        return;
      }

      const enfraquecido = this.enemyStatus?.tipo === 'sombrio';
      let dano = computeEnemyDamage(enemyDef.ataque, stats.defesa);
      if (enfraquecido) {
        dano = Math.max(1, Math.round(dano * 0.7));
        this.decayEnemyStatus();
      }

      this.log(`💥 ${enemyDef.nome} atacou e causou ${dano} de dano.`);
      this.strikeSprite(this.enemySprite, -32);
      this.flashSprite(this.playerSprite);
      this.flashDamageOverlay();
      this.time.delayedCall(90, () => {
        this.impactBurst(this.playerSprite.x, this.playerSprite.y);
        this.shakeForHit(enemyDef.tier);
      });
      player.vida = Math.max(0, player.vida - dano);
      this.updateBars(player);

      if (player.vida <= 0) {
        this.defeat(player);
        return;
      }

      this.turnBusy = false;
      this.setButtonsEnabled(true);
    };

    if (isBoss) {
      this.log(`⚠️ ${enemyDef.nome} prepara um golpe poderoso...`);
      this.time.delayedCall(750, resolve);
    } else {
      this.time.delayedCall(500, resolve);
    }
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
      scale: this.enemySprite.scale * 0.35,
      angle: 30,
      duration: 420,
      ease: 'Cubic.easeIn',
    });

    if (enemyDef.tier === 'boss') {
      this.cameras.main.shake(350, 0.02);
      this.cameras.main.flash(220, 60, 30, 90);
    }

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
