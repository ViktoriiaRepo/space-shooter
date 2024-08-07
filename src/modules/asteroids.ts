import { Application } from 'pixi.js';
import { Asteroid } from './asteroid';

export class Asteroids {
  asteroids: Asteroid[] = [];
  app: Application;
  maxAsteroids: number;
  asteroidCreatedCount: number = 0;
  maxActiveAsteroids: number = 5;

  constructor(app: Application, maxAsteroids: number) {
    this.app = app;
    this.maxAsteroids = maxAsteroids;
  }

  startSpawning() {
    this.createAsteroidsIfNeeded();
  }

  async createAsteroid() {
    const asteroid = new Asteroid(this.app);
    await asteroid.init();
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
}
