import { Application, AnimatedSprite, Texture, Assets } from 'pixi.js';

export class Explosion {
  private app: Application;
  private static explosionTextures: Texture[] = [];
  private static texturesLoaded = false;
  private explosion: AnimatedSprite;

  constructor(app: Application) {
    this.app = app;
  }

  explode(x: number, y: number, scale: number = 1): Promise<void> {
    const f = async (resolve: (value: void) => void) => {
      if (!Explosion.texturesLoaded) {
        await this.loadTextures();
      }
      this.createExplosion(x, y, scale, () => {
        this.explosion.destroy();
        resolve();
      });
    };
    return new Promise<void>(f);
  }

  private async loadTextures() {
    const sheet = await Assets.load('/assets/frames.json');

    for (let i = 0; i < 26; i++) {
      const texture = Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
      Explosion.explosionTextures.push(texture);
    }

    Explosion.texturesLoaded = true;
  }

  private createExplosion(
    x: number,
    y: number,
    scale: number,
    cb: () => void
  ): void {
    this.explosion = new AnimatedSprite(Explosion.explosionTextures);
    this.explosion.anchor.set(0.5);
    this.explosion.x = x;
    this.explosion.y = y;
    this.explosion.scale.set(scale);
    this.explosion.loop = false;

    this.app.stage.addChild(this.explosion);
    this.explosion.gotoAndPlay(0);

    this.explosion.onComplete = cb;
  }
}
