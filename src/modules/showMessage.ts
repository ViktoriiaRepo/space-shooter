import { TextStyle, Text, Application } from 'pixi.js';

export function showMessage(
  app: Application,
  message: string,
  timerInterval: NodeJS.Timeout
) {
  clearInterval(timerInterval);

  const style = new TextStyle({
    fontSize: 72,
    fontWeight: 'bold',
    fill: '#f60059',
    align: 'center',
  });

  const messageText = new Text(message, style);
  messageText.anchor.set(0.5);
  messageText.x = app.screen.width / 2;
  messageText.y = app.screen.height / 2;

  app.stage.addChild(messageText);
}
