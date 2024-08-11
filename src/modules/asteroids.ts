import { Application, Assets, Texture } from 'pixi.js';
import { Asteroid } from './asteroid';

export class Asteroids {
  asteroids: Asteroid[] = [];
  app: Application;
  maxAsteroids: number;
  asteroidCreatedCount: number = 0;
  maxActiveAsteroids: number = 10;
  texture: Texture;

  constructor(app: Application, maxAsteroids: number) {
    this.app = app;
    this.maxAsteroids = maxAsteroids;
  }

  async init(): Promise<Texture> {
    return Assets.load('img/asteroid180.png').then(
      (a: Texture) => (this.texture = a)
    );
  }

  startSpawning() {
    this.createAsteroidsIfNeeded();
  }

  async createAsteroid() {
    const asteroid = new Asteroid(this.app);
    asteroid.init(this.texture);
    this.asteroids.push(asteroid);
    this.app.stage.addChild(asteroid.sprite);
  }

  createAsteroidsIfNeeded() {
    if (
      this.asteroidCreatedCount < this.maxAsteroids &&
      this.asteroids.length < this.maxActiveAsteroids
    ) {
      this.createAsteroid();
      this.asteroidCreatedCount++;
    }
  }

  update() {
    this.asteroids.forEach((asteroid, index) => {
      asteroid.update();
      if (asteroid.isOutOfBounds()) {
        this.app.stage.removeChild(asteroid.sprite);
        this.asteroids.splice(index, 1);
      }
    });

    this.createAsteroidsIfNeeded();
  }
  deleteAll(): void {
    this.asteroids.forEach((asteroid) => {
      this.app.stage.removeChild(asteroid.sprite);
      asteroid.destroy();
    });
    this.asteroids = [];
  }
}
