import { Application, Sprite, Assets } from 'pixi.js';

export class Asteroid {
  sprite: Sprite;
  app: Application;
  speed: number;

  constructor(app: Application) {
    this.app = app;
    this.speed = 2;
    this.sprite = new Sprite();
    this.init();
  }

  async init() {
    const texture = await Assets.load('img/asteroid180.png');
    this.sprite.texture = texture;

    this.sprite.anchor.set(0.5);
    this.sprite.x =
      Math.random() * (this.app.screen.width - this.sprite.width) +
      this.sprite.width / 2;
    this.sprite.y = Math.random() * -this.sprite.height;

    this.app.stage.addChild(this.sprite);
  }

  update() {
    if (this.sprite) {
      this.sprite.y += this.speed;

      if (this.sprite.y > this.app.screen.height) {
        this.sprite.y = Math.random() * -this.sprite.height;
        this.sprite.x =
          Math.random() * (this.app.screen.width - this.sprite.width) +
          this.sprite.width / 2;
      }
    }
  }
}
