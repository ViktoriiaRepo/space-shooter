import { TextStyle, Text, Application } from 'pixi.js';
import { GamePlay } from '../gamePlay';

export class Message {
  app: Application;
  gamePlay: GamePlay;

  constructor(app: Application) {
    this.app = app;
  }

  show(message: string, duration: number = 2000): Promise<void> {
    this.gamePlay.pause();

    const style = new TextStyle({
      fontSize: 72,
      fontWeight: 'bold',
      fill: '#f60059',
      align: 'center',
    });

    const messageText = new Text({ text: message, style });
    messageText.anchor.set(0.5);
    messageText.x = this.app.screen.width / 2;
    messageText.y = this.app.screen.height / 2;

    this.app.stage.addChild(messageText);
    

    const ret: Promise<void> = new Promise<void>((resolve) => {
      setTimeout(() => resolve(), duration);
    }).then(() => {
      this.app.stage.removeChild(messageText);

      this.app.render();
      this.gamePlay.resume();
    });
    return ret;
  }
}
