import './index.html';
import './styles.css';

import { Application } from 'pixi.js';
import { Spaceship } from '../src/modules/spaseship';
import { Stars } from './modules/stars';
import { Asteroids } from './modules/asteroids';
import { Boss } from './modules/boss';
import { GamePlay } from './modules/gamePlay';
import { Message } from './modules/utils/message';

const app = new Application();

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const wrapper = document.querySelector('.wrapper');

(async () => {
  await app.init({
    width: 1280,
    height: 720,
    canvas: canvas,
  });

  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'timer';
  wrapper?.appendChild(timerDisplay);

  const bulletsAmmount = document.createElement('div');
  bulletsAmmount.id = 'bullets-ammount';
  wrapper?.appendChild(bulletsAmmount);

  const HP = document.createElement('div');
  HP.id = 'hp';
  wrapper?.appendChild(HP);

  const startButton = document.createElement('button');
  startButton.id = 'start-new-game';
  startButton.textContent = 'Start new game';
  wrapper?.appendChild(startButton);

  const stars = new Stars(app);
  stars.startAnimation();

  const player = new Spaceship(app);

  const asteroids = new Asteroids(app, 10);

  await asteroids.init();

  const message = new Message(app);

  const boss = new Boss(app);

  const gamePlay = new GamePlay();
  gamePlay.stars = stars;
  gamePlay.player = player;
  gamePlay.ticker = app.ticker;
  gamePlay.asteroids = asteroids;
  gamePlay.message = message;
  gamePlay.boss = boss;

  message.gamePlay = gamePlay;

  gamePlay.timerDisplay = document.getElementById('timer') as HTMLDivElement;
  gamePlay.bulletsAmmount = document.getElementById(
    'bullets-ammount'
  ) as HTMLDivElement;

  await boss.init();

  gamePlay.hpDisplay = document.getElementById('hp') as HTMLDivElement;

  gamePlay.initTicker();

  gamePlay.gameOver = () => (startButton.style.display = 'block');

  function startGame() {
    startButton.style.display = 'none';
    gamePlay.startGame();
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
    gamePlay.keyPress(e.key);
  });

  startButton.addEventListener('click', startGame);
})();
