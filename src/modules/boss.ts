import { Application, Assets, Sprite } from 'pixi.js';
import { BossBullet } from './bossBullet';
import { Explosion } from './explosion';

export class Boss {
  sprite: Sprite;
  app: Application;
  hp: number;
  maxHp: number = 4;
  shootInterval: any;
  moveDirection: number = 1;
  moveSpeed: number = 2;
  changeDirectionInterval: any;
  bossBullets: BossBullet[] = [];

  constructor(app: Application) {
    this.app = app;
  }

  async init() {
    const texture = await Assets.load('img/boss.png');
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
  }

  appear(): void {
    this.hp = this.maxHp;

    this.sprite.x = this.app.screen.width / 2;
    this.sprite.y = this.app.screen.height / 4;

    this.app.stage.addChild(this.sprite);

    this.startMoving();
  }

  startMoving(): void {
    this.changeDirectionInterval = setInterval(() => {
      this.moveDirection = Math.random() < 0.5 ? -1 : 1;
    }, 1000);

    this.shootInterval = setInterval(() => this.shoot(), 2000);
  }

  shoot(): void {
    const bullet = new BossBullet(
      this.app,
      this.sprite.x,
      this.sprite.y,
      this.sprite.height
    );
    this.bossBullets.push(bullet);

    this.app.ticker.add(() => {
      bullet.update();
      if (bullet.isOffScreen()) {
        bullet.destroy();
        this.bossBullets = this.bossBullets.filter((b) => b !== bullet);
      }
    });
  }

  update(): void {
    this.sprite.x += this.moveSpeed * this.moveDirection;

    if (this.sprite.x <= this.sprite.width / 2) {
      this.sprite.x = this.sprite.width / 2;
      this.moveDirection = 1;
    } else if (this.sprite.x >= this.app.screen.width - this.sprite.width / 2) {
      this.sprite.x = this.app.screen.width - this.sprite.width / 2;
      this.moveDirection = -1;
    }
  }

  stopMoving(): void {
    clearInterval(this.changeDirectionInterval);
    clearInterval(this.shootInterval);
  }

  takeDamage(amount: number): void {
    this.hp -= amount;

    if (this.hp <= 0) {
      this.app.stage.removeChild(this.sprite);
      this.stopMoving();
    }
  }

  async disappear() {
    this.app.stage.removeChild(this.sprite);
    this.stopMoving();
  }

  async explode() {
    const x = this.sprite.x;
    const y = this.sprite.y;

    this.app.stage.removeChild(this.sprite);

    const exp: Explosion = new Explosion(this.app);
    await exp.explode(x, y, 2);
  }

  clearBullets(): void {
    this.bossBullets.forEach((bossBullet) => {
      bossBullet.destroy();
    });
    this.bossBullets = [];
  }
}
