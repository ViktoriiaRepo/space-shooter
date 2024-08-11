import { Application, Graphics, Sprite } from 'pixi.js';
import { Explosion } from './explosion';

export class BossBullet {
  sprite: Graphics;
  app: Application;
  speed: number;

  constructor(app: Application, x: number, y: number, bossHeight: number) {
    this.app = app;
    this.speed = 10;

    this.sprite = new Graphics().circle(-2, -6, 10).fill(0xff0000);

    this.sprite.x = x;
    this.sprite.y = y + bossHeight / 2;

    this.app.stage.addChild(this.sprite);
  }

  update() {
    this.sprite.y += this.speed;
  }

  isOffScreen(): boolean {
    return this.sprite.y < 0;
  }

  destroy() {
    this.app.stage.removeChild(this.sprite);
  }

  async explode() {
    const x = this.sprite.x;
    const y = this.sprite.y;

    this.app.stage.removeChild(this.sprite);

    const exp: Explosion = new Explosion(this.app);
    await exp.explode(x, y, 0.3);
  }
}
