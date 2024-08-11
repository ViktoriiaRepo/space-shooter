import { Application, Assets, Sprite, Texture, Ticker } from 'pixi.js';

interface Star {
  sprite: Sprite;
  z: number;
  x: number;
  y: number;
}

export class Stars {
  starAmount: number = 1000;
  cameraZ: number = -2;
  fov: number = 20;
  baseSpeed: number = 0.025;
  speed: number = 0;
  warpSpeed: number = 0;
  starStretch: number = 5;
  starBaseSize: number = 0.05;

  stars: Star[] = [];
  starTexture: Texture;
  app: Application;

  constructor(app: Application) {
    this.app = app;
    this.init();
  }

  async init() {
    this.starTexture = await Assets.load('img/star.png');

    for (let i = 0; i < this.starAmount; i++) {
      const star = {
        sprite: new Sprite(this.starTexture),
        z: 0,
        x: 0,
        y: 0,
      };

      star.sprite.anchor.x = 0.5;
      star.sprite.anchor.y = 0.7;
      this.randomizeStar(star, true);
      this.app.stage.addChild(star.sprite);
      this.stars.push(star);
    }
    this.startAnimation();
  }

  randomizeStar(star: Star, initial: boolean): void {
    star.z = initial
      ? Math.random() * 2000
      : this.cameraZ + Math.random() * 1000 + 2000;

    const deg = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 1;

    star.x = Math.cos(deg) * distance;
    star.y = Math.sin(deg) * distance;
  }
  startAnimation() {
    this.app.ticker.add(this.animate, this);
  }
  animate(time: Ticker) {
    if (!this.stars.length) return;

    this.speed += (this.warpSpeed - this.speed) / 20;

    this.cameraZ += time.deltaTime * 10 * (this.speed + this.baseSpeed);
    for (let i = 0; i < this.starAmount; i++) {
      const star = this.stars[i];

      if (star.z < this.cameraZ) this.randomizeStar(star, false);

      const z = star.z - this.cameraZ;

      star.sprite.x =
        star.x * (this.fov / z) * this.app.renderer.screen.width +
        this.app.renderer.screen.width / 2;
      star.sprite.y =
        star.y * (this.fov / z) * this.app.renderer.screen.width +
        this.app.renderer.screen.height / 2;

      const dxCenter = star.sprite.x - this.app.renderer.screen.width / 2;
      const dyCenter = star.sprite.y - this.app.renderer.screen.height / 2;
      const distanceCenter = Math.sqrt(
        dxCenter * dxCenter + dyCenter * dyCenter
      );
      const distanceScale = Math.max(0, (2000 - z) / 2000);

      star.sprite.scale.x = distanceScale * this.starBaseSize;

      star.sprite.scale.y =
        distanceScale * this.starBaseSize +
        (distanceScale * this.speed * this.starStretch * distanceCenter) /
          this.app.renderer.screen.width;
      star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
    }
  }
}
