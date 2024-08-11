import { Ticker } from 'pixi.js';
import { Asteroids } from './asteroids';
import { Spaceship } from './spaseship';
import { Stars } from './stars';
import { Boss } from './boss';
import { Message } from './utils/message';
import { hitTestCircle } from './utils/hitTestCircle';
import { hitTestRectangle } from './utils/hitTestRectangle';

export class GamePlay {
  timeLeft: number = 60;
  maxAmountBullet: number = 10;
  currentAmountBullet: number;
  gameLost: boolean = false;
  paused: boolean = false;
  level: number = 0;
  stars: Stars;
  player: Spaceship;
  ticker: Ticker;
  asteroids: Asteroids;
  boss: Boss;

  timerDisplay: HTMLDivElement;
  bulletsAmmount: HTMLDivElement;
  hpDisplay: HTMLDivElement;

  timerInterval: NodeJS.Timeout;
  message: Message;
  gameOver: () => void;

  initTicker(): void {
    this.ticker.add(() => this.tickerUpdater());
  }

  tickerUpdater(): void {
    if (this.level < 1) return;
    if (this.paused) return;

    this.player.update();
    if (this.level === 1) {
      this.asteroids.update();
    } else {
      this.boss.update();
    }
    this.checkCollisions();
    this.updateAmountDisplay();
  }

  resetGame() {
    this.level = 0;
    this.timeLeft = 60;
    this.maxAmountBullet = 10;
    this.currentAmountBullet = this.maxAmountBullet;
    this.gameLost = false;
    this.paused = false;

    this.player.removeBullets();
    this.player.initPosition();
    this.player.appear();

    this.asteroids.deleteAll();
    this.asteroids.asteroidCreatedCount = 0;

    this.boss.disappear();

    this.boss.clearBullets();

    this.updateAmountDisplay();

    this.hpDisplay.style.display = 'none';
  }

  startGame() {
    this.resetGame();

    this.message.show('LEVEL 1', 1000);

    this.level = 1;

    if (this.timerDisplay) {
      this.timerDisplay.textContent = this.timeLeft.toString();
    }
    this.updateAmountDisplay();

    this.asteroids.startSpawning();

    this.timerInterval = setInterval(() => this.timerDecrease(), 1000);

    this.ticker.start();
  }

  timerDecrease() {
    if (this.paused) return;
    this.timeLeft--;
    if (this.timerDisplay) {
      this.timerDisplay.textContent = this.timeLeft.toString();
    }
    if (this.timeLeft <= 0) {
      clearInterval(this.timerInterval);
    }
  }

  updateAmountDisplay() {
    if (this.bulletsAmmount) {
      this.bulletsAmmount.textContent = `bullets ${this.currentAmountBullet}/${this.maxAmountBullet}`;
    }
  }
  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }

  checkCollisionLevel1() {
    this.player.bullets.forEach((bullet, bulletIndex) => {
      this.asteroids.asteroids.forEach((asteroid, asteroidIndex) => {
        if (hitTestCircle(bullet.sprite, asteroid.sprite, 10)) {
          bullet.destroy();
          this.player.bullets.splice(bulletIndex, 1);
          this.asteroids.asteroids.splice(asteroidIndex, 1);
          asteroid.explode().then(() => asteroid.destroy());
        }
      });
    });

    if (
      this.asteroids.asteroids.length === 0 &&
      this.asteroids.asteroidCreatedCount >= this.asteroids.maxAsteroids
    ) {
      this.pause();
      clearInterval(this.timerInterval);
      this.message.show('LEVEL 2', 1000).then(() => {
        this.startBossLevel();
      });
    } else if (
      (this.currentAmountBullet === 0 &&
        this.player.bullets.length === 0 &&
        this.asteroids.asteroids.length > 0) ||
      this.timeLeft <= 0
    ) {
      this.message.show('YOU LOSE', 1000);

      this.gameLost = true;
      clearInterval(this.timerInterval);
      this.level = 0;

      if (this.gameOver) {
        this.gameOver();
      }
    }
  }

  checkCollisionLevel2() {
    this.player.bullets.forEach((bullet, bulletIndex) => {
      if (hitTestCircle(bullet.sprite, this.boss.sprite, 10)) {
        this.boss.takeDamage(1);
        bullet.destroy();
        this.player.bullets.splice(bulletIndex, 1);
        this.updateHpDisplay();
      }

      this.boss.bossBullets.forEach((bossBullet, bossBulletIndex) => {
        if (hitTestCircle(bullet.sprite, bossBullet.sprite, 0)) {
          bullet.destroy();
          bossBullet.explode();
          this.player.bullets.splice(bulletIndex, 1);
          this.boss.bossBullets.splice(bossBulletIndex, 1);
        }
      });
    });

    this.boss.bossBullets.forEach((bossBullet, bossBulletIndex) => {
      if (
        this.player.sprite &&
        hitTestRectangle(bossBullet.sprite, this.player.sprite)
      ) {
        this.player.explode();
        this.player.playerKilled = true;

        bossBullet.destroy();
        this.boss.bossBullets.splice(bossBulletIndex, 1);
      }
    });

    if (this.boss.hp === 0 && !this.player.playerKilled) {
      this.message.show('YOU WIN', 2000);
      this.level = 0;
      clearInterval(this.timerInterval);

      this.gameLost = true;
      this.boss.clearBullets();
      this.player.removeBullets();
      this.boss.explode();
      this.resetGame();
      if (this.gameOver) {
        this.gameOver();
      }
    } else if (this.player.playerKilled) {
      this.message.show('YOU LOSE', 1000);

      this.gameLost = true;
      clearInterval(this.timerInterval);

      this.boss.clearBullets();
      this.resetGame();

      if (this.gameOver) {
        this.gameOver();
      }
    }
  }

  checkCollisions() {
    if (this.level === 1) {
      this.checkCollisionLevel1();
    } else {
      this.checkCollisionLevel2();
    }
  }

  updateHpDisplay() {
    if (this.hpDisplay) {
      this.hpDisplay.textContent = `HP ${this.boss.hp}/${this.boss.maxHp}`;
    }
  }

  startBossLevel() {
    this.pause();
    this.timeLeft = 60;
    this.maxAmountBullet = 10;
    this.currentAmountBullet = this.maxAmountBullet;
    this.gameLost = false;

    this.player.removeBullets();
    this.player.initPosition();

    this.boss.appear();

    this.level = 2;
    this.player.maxBullets = 10;

    this.updateAmountDisplay();
    this.hpDisplay.style.display = 'block';
    this.updateHpDisplay();
    this.timerInterval = setInterval(() => this.timerDecrease(), 1000);

    this.resume();
  }

  keyPress(key: string) {
    if (key === 'ArrowLeft' || key === 'a') {
      this.player.moveLeft();
    } else if (key === 'ArrowRight' || key === 'd') {
      this.player.moveRight();
    } else if (key === ' ') {
      if (this.currentAmountBullet > 0) {
        this.player.shoot();
        this.currentAmountBullet--;
        this.updateAmountDisplay();
      }
    }
  }
}
