import { Application, Assets, Sprite } from 'pixi.js';

export class Boss {
  sprite: Sprite;
  app: Application;
  hp: number;
  maxHp: number = 4;
  shootInterval: any;
  moveDirection: number = 1;

  constructor(app: Application) {
    this.app = app;
    this.hp = this.maxHp;
  }

  async init() {
    const texture = await Assets.load('img/boss.png');

    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.x = this.app.screen.width / 2;
    this.sprite.y = this.app.screen.height / 4;

    this.app.stage.addChild(this.sprite);
  }
}
