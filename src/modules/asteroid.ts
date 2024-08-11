import { Application, Sprite, Texture } from 'pixi.js';
import { Explosion } from './explosion';

export class Asteroid {
  sprite: Sprite;
  app: Application;
  speed: number;

  constructor(app: Application) {
    this.app = app;
    this.speed = 0.3;
    this.sprite = new Sprite();
  }

  async init(texture: Texture) {
    this.sprite.texture = texture;

    this.sprite.anchor.set(0.5);
    this.sprite.x =
      Math.random() * (this.app.screen.width - this.sprite.width) +
      this.sprite.width / 2;
    this.sprite.y = Math.random() * (-this.sprite.height * 3);

    this.sprite.rotation = Math.random() * Math.PI * 2;

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

        this.sprite.rotation = Math.random() * Math.PI * 2;
      }
    }
  }

  isOutOfBounds(): boolean {
    return this.sprite.y > this.app.screen.height;
  }

  async explode() {
    const x = this.sprite.x;
    const y = this.sprite.y;

    this.app.stage.removeChild(this.sprite);

    const exp: Explosion = new Explosion(this.app);
    await exp.explode(x, y, 0.7);
  }

  destroy() {
    this.sprite.destroy({ texture: false });
  }
}
