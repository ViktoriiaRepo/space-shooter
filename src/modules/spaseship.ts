import { Application, Sprite, Assets } from 'pixi.js';
import { Bullet } from './bullet';

export class Spaceship {
  sprite: Sprite;
  speed: number;
  app: Application;
  bullets: Bullet[] = [];
  maxBullets: number = 10;

  constructor(app: Application) {
    this.app = app;
    this.speed = 3;
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

  shoot() {
    if (this.bullets.length < this.maxBullets) {
      const bullet = new Bullet(
        this.app,
        this.sprite.x,
        this.sprite.y - this.sprite.height / 2
      );
      this.bullets.push(bullet);
    }
  }

  update() {
    this.bullets.forEach((bullet, index) => {
      bullet.update();
      if (bullet.isOffScreen()) {
        bullet.destroy();
        this.bullets.splice(index, 1);
        console.log('this.bullets :>> ', this.bullets);
      }
    });
  }
}
