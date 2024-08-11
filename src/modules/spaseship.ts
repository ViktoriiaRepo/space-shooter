import { Application, Sprite, Assets } from 'pixi.js';
import { Bullet } from './bullet';
import { Explosion } from './explosion';

export class Spaceship {
  sprite: Sprite;
  speed: number;
  app: Application;
  bullets: Bullet[] = [];
  maxBullets: number = 10;
  playerKilled: boolean = false;

  constructor(app: Application) {
    this.app = app;
    this.speed = 4;
    this.init();
  }

  async init() {
    const texture = await Assets.load('img/smallshipyellow.png');
    this.sprite = new Sprite(texture);

    this.sprite.anchor.set(0.5);
    this.sprite.x = this.app.screen.width / 2;
    this.sprite.y = this.app.screen.height - 150;

    this.appear();
  }

  initPosition() {
    this.sprite.x = this.app.screen.width / 2;
    this.sprite.y = this.app.screen.height - 150;
  }

  moveLeft() {
    if (this.sprite) {
      this.sprite.x = Math.max(
        this.sprite.width / 2,
        this.sprite.x - this.speed
      );
    }
  }

  moveRight() {
    if (this.sprite) {
      this.sprite.x = Math.min(
        this.app.screen.width - this.sprite.width / 2,
        this.sprite.x + this.speed
      );
    }
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
      }
    });
  }

  async explode() {
    const x = this.sprite.x;
    const y = this.sprite.y;

    this.app.stage.removeChild(this.sprite);

    const exp: Explosion = new Explosion(this.app);
    await exp.explode(x, y, 0.7);
  }

  disappear() {
    if (this.sprite) {
      this.playerKilled = true;
      this.app.stage.removeChild(this.sprite);
    }
  }

  appear() {
    if (this.sprite) {
      this.playerKilled = false;
      this.app.stage.addChild(this.sprite);
    }
  }

  removeBullets() {
    this.bullets.forEach((bullet, index) => {
      bullet.destroy();
    });

    this.bullets = [];
  }
}
