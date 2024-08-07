import './index.html';
import './styles.css';

import { Application, Color, FillGradient, TextStyle, Text } from 'pixi.js';
import { Spaceship } from '../src/modules/spaseship';
import { Stars } from './modules/stars';
import { Asteroids } from './modules/asteroids';
import { showMessage } from './modules/showMessage';
import { Boss } from './modules/boss';

const app = new Application();

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const wrapper = document.querySelector('.wrapper');

(async () => {
  await app.init({
    width: 1280,
    height: 720,
    view: canvas,
  });

  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'timer';
  wrapper?.appendChild(timerDisplay);

  const bulletsAmmount = document.createElement('div');
  bulletsAmmount.id = 'bullets-ammount';
  wrapper?.appendChild(bulletsAmmount);

  const startButton = document.createElement('button');
  startButton.id = 'start-new-game';
  startButton.textContent = 'Start new game';
  wrapper?.appendChild(startButton);

  // Create stars
  const stars = new Stars(app);
  stars.startAnimation();

  // Create player
  const player = new Spaceship(app);

  function startGame() {
    startButton.style.display = 'none';

    app.stage.removeChildren();
    app.ticker.stop();

    //Create stars
    const stars = new Stars(app);
    stars.startAnimation();

    const timerDisplay = document.getElementById('timer') as HTMLDivElement;
    const bulletsAmmount = document.getElementById(
      'bullets-ammount'
    ) as HTMLDivElement;
    let timeLeft = 60;
    let maxAmmountBullet = 10;
    let currentAmmountBullet = maxAmmountBullet;
    let gameLost = false;

    if (timerDisplay) {
      timerDisplay.textContent = timeLeft.toString();
    }
    if (bulletsAmmount) {
      bulletsAmmount.textContent = `bullets ${currentAmmountBullet}/${maxAmmountBullet}`;
    }

    //Create player
    const player = new Spaceship(app);

    // Create asteroids
    const asteroids = new Asteroids(app, 10);
    asteroids.startSpawning();

    const timerInterval = setInterval(() => {
      timeLeft--;
      if (timerDisplay) {
        timerDisplay.textContent = timeLeft.toString();
      }
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        app.ticker.stop();
      }
    }, 1000);

    function updateAmmountDisplay() {
      if (bulletsAmmount) {
        bulletsAmmount.textContent = `bullets ${currentAmmountBullet}/${maxAmmountBullet}`;
      }
    }

    app.ticker.add(() => {
      player.update();
      asteroids.update();
      checkCollisions();
      updateAmmountDisplay();
    });

    function checkCollisions() {
      player.bullets.forEach((bullet, bulletIndex) => {
        asteroids.asteroids.forEach((asteroid, asteroidIndex) => {
          if (hitTestRectangle(bullet.sprite, asteroid.sprite)) {
            bullet.destroy();
            asteroid.sprite.destroy();
            player.bullets.splice(bulletIndex, 1);
            asteroids.asteroids.splice(asteroidIndex, 1);
          }
        });
      });

      if (
        asteroids.asteroids.length === 0 &&
        asteroids.asteroidCreatedCount >= asteroids.maxAsteroids
      ) {
        app.ticker.stop();
        showMessage(app, 'YOU WIN', timerInterval);
        // startBossLevel();
      }
      if (
        currentAmmountBullet === 0 &&
        asteroids.asteroids.length > 0 &&
        !gameLost
      ) {
        showMessage(app, 'YOU LOSE', timerInterval);
        gameLost = true;
        app.ticker.stop();
      }
    }

    // function startBossLevel() {
    //   app.stage.removeChildren();

    //   const boss = new Boss(app);
    //   boss.init().then(() => {
    //     app.stage.addChild(boss.sprite);
    //     app.ticker.start();
    //   });
    // }

    function hitTestRectangle(r1: any, r2: any): boolean {
      const r1Bounds = r1.getBounds();
      const r2Bounds = r2.getBounds();

      return (
        r1Bounds.x < r2Bounds.x + r2Bounds.width &&
        r1Bounds.x + r1Bounds.width > r2Bounds.x &&
        r1Bounds.y < r2Bounds.y + r2Bounds.height &&
        r1Bounds.y + r1Bounds.height > r2Bounds.y
      );
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        player.moveRight();
      } else if (e.key === ' ') {
        if (currentAmmountBullet > 0) {
          player.shoot();
          currentAmmountBullet--;
          updateAmmountDisplay();
        }
      }
    });

    // console.log('maxAmmountBullet :>> ', maxAmmountBullet);
    // console.log('currentAmmountBullet :>> ', currentAmmountBullet);

    app.ticker.start();
  }

  startButton.addEventListener('click', startGame);
})();
