import './index.html';
import './styles.css';

import { Application, Assets, Sprite } from 'pixi.js';
import { Spaceship } from '../src/modules/spaseship';
import { Stars } from './modules/stars';
import { Asteroids } from './modules/asteroids';

interface Star {
  sprite: Sprite;
  z: number;
  x: number;
  y: number;
}
(async () => {
  const app = new Application();

  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

  await app.init({
    width: 1280,
    height: 720,
    view: canvas,
  });

  //Create the Stars
  const stars = new Stars(app);
  stars.startAnimation();

  // Create the player
  const player = new Spaceship(app);

  //Create asteroids
  const asteroid = new Asteroids(app, 5);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      player.moveLeft();
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      player.moveRight();
    }
  });
})();
