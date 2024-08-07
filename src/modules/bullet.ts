import { Application, Graphics } from 'pixi.js';

export class Bullet {
  sprite: Graphics;
  app: Application;
  speed: number;

  constructor(app: Application, x: number, y: number) {
    this.app = app;
    this.speed = 10;

    this.sprite = new Graphics().circle(-2, -6, 6).fill(0xffffff);

    this.sprite.x = x;
    this.sprite.y = y;

    this.app.stage.addChild(this.sprite);
  }

  update() {
    this.sprite.y -= this.speed;
  }

  isOffScreen(): boolean {
    return this.sprite.y < 0;
  }

  destroy() {
    this.app.stage.removeChild(this.sprite);
  }
}
