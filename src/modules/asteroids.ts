import { Application } from 'pixi.js';
import { Asteroid } from './asteroid';

export class Asteroids {
  asteroids: Asteroid[] = [];
  app: Application;
  asteroidCount: number;

  constructor(app: Application, count: number) {
    this.app = app;
    this.asteroidCount = count;
    this.init();
  }

  init() {
    for (let i = 0; i < this.asteroidCount; i++) {
      const asteroid = new Asteroid(this.app);

      this.asteroids.push(asteroid);
    }

    this.app.ticker.add(this.update, this);
  }

  update() {
    this.asteroids.forEach((asteroid) => asteroid.update());
  }
}
