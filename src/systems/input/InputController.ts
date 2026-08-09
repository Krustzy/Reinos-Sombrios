export interface DirectionState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

/** Unifies WASD/arrow keyboard input with on-screen touch d-pad buttons into one direction state. */
export class InputController {
  private touch: DirectionState = { up: false, down: false, left: false, right: false };
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };

  constructor(scene: Phaser.Scene) {
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasd = scene.input.keyboard.addKeys('W,A,S,D') as typeof this.wasd;
    }
  }

  setTouchDirection(dir: keyof DirectionState, active: boolean): void {
    this.touch[dir] = active;
  }

  getDirection(): DirectionState {
    return {
      up: this.touch.up || !!this.cursors?.up.isDown || !!this.wasd?.W.isDown,
      down: this.touch.down || !!this.cursors?.down.isDown || !!this.wasd?.S.isDown,
      left: this.touch.left || !!this.cursors?.left.isDown || !!this.wasd?.A.isDown,
      right: this.touch.right || !!this.cursors?.right.isDown || !!this.wasd?.D.isDown,
    };
  }
}
