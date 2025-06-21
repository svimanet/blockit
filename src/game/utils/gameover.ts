import { Application, Text as PixiText } from 'pixi.js';
import { renderHiscoresTable } from '../../hiscores';
import type { Hiscore } from '../types';

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

  const hiscoresStorage = window.localStorage.getItem('hiscores') as string;
  const hiscores = JSON.parse(hiscoresStorage) as Array<Hiscore>;
  const scoreElement = document.getElementById('score') as HTMLSpanElement;
  const score = scoreElement.innerText;

  hiscores.push({
    date: new Date(),
    score: Number(score),
  });

  window.localStorage.setItem('hiscores', JSON.stringify(hiscores));

  renderHiscoresTable();
}


