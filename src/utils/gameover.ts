import { Application, Text as PixiText } from 'pixi.js';

export const gameover = (app: Application) => {
  const text = new PixiText('Game Over!', {
    fontSize: 36,
    fill: 0xffffff,
    align: 'center',
  });

  text.x = app.screen.width * .5;
  text.y = app.screen.width * .5;
  text.anchor.set(0.5);

  app.stage.addChild(text);
  app.stage.removeAllListeners();

  const header = document.getElementById('header') as HTMLDivElement;
  const btn = document.createElement('button');
  btn.textContent = 'Restart';
  btn.setAttribute('id', 'btn');
  btn.onclick = () => location.reload();
  header.append(btn);
}
