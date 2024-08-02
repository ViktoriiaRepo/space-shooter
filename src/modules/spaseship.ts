import { Application, Sprite, Assets } from 'pixi.js';

export class Spaceship {
  sprite: Sprite;
  speed: number;
  app: Application;

  constructor(app: Application) {
    this.app = app;
    this.speed = 10;
    this.init();
  }

  async init() {
    const texture = await Assets.load('img/smallshipyellow.png');
    this.sprite = new Sprite(texture);

    this.sprite.anchor.set(0.5);
    this.sprite.x = this.app.screen.width / 2;
    this.sprite.y = this.app.screen.height - 150;

    this.app.stage.addChild(this.sprite);
  }

  moveLeft() {
    this.sprite.x = Math.max(this.sprite.width / 2, this.sprite.x - this.speed);
  }

  moveRight() {
    this.sprite.x = Math.min(
      this.app.screen.width - this.sprite.width / 2,
      this.sprite.x + this.speed
    );
  }
}
