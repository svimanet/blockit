import { Application, Text as PixiText } from 'pixi.js';

export const gameover = (app: Application) => {
  const text = new PixiText('Game Over!', {
    fontSize: 36,
    fill: 0xffffff,
    align: 'center',
  });

  // Set the position of the text
  text.x = app.screen.width * .5;
  text.y = app.screen.width * .5;

  // Anchor it to the center
  text.anchor.set(0.5);

  // Add the text to the stage (scene)
  app.stage.addChild(text);

  const header = document.getElementById('header') as HTMLDivElement;
  const hh = ''+header.innerHTML;
  
  const btn = '<button id="resetbtn">Restart</button>';
  header.innerHTML = hh + btn;



}
