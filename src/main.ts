console.log('Game JS loading.');

import { checkLineCompletion, deleteEmptyFigures } from './utils/lineCompletion';
import { canFitNewShape, newRandomFigure } from './figure/utils';
import { Figure } from './figure/figure';
import { makeShapes } from './figure/shapes';
import { renderGrid } from './utils/grid';
import { Application, BitmapText, Text as PixiText } from 'pixi.js';
import { incrementScore } from './utils/score';
import { gameover } from './utils/gameover';

const gameContainer = document.getElementById('game') as HTMLDivElement;
const scoreCounter = document.getElementById('score') as HTMLSpanElement;
let width = gameContainer.clientWidth;
const height = gameContainer.clientHeight;

// Make sure height is up to the task of 175% width.
if (height < width*1.5) width = height / 1.75;

const numCells = 10;
const padding = (width / 100) * 5; // 5% on both sides
const cellsize = (width - (padding*2)) / 10;
const gridSize = numCells * cellsize;
const canvasWidth = padding + gridSize + padding;
const canvasHeight = canvasWidth*1.5;

let figures: Figure[] = [];
const shapes = makeShapes(cellsize);
const figureStartPos = {
  x: padding, // TODO more dynamic x pos i guess
  y:(cellsize*10)+(padding*2)
};

const app = new Application({
  background: '#333333',
  height: canvasHeight,
  width: canvasWidth,
});
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

// Target getter and setter for mouse event. Only one at a time on global scope.
// Setter supplied to Figure constructor for container onclick target switching.
let dragTarget: Figure | undefined; 
const setDragTarget = (target: Figure) => dragTarget = target;
app.stage.on('pointermove', (e) => dragTarget && dragTarget.move(e));

/* Clear dragTarget whenever mousebutton is released in app. */
app.stage.on('pointerup', () => {
  if (dragTarget) {
    const placedFigure = dragTarget.stopMoving(figures, cellsize, padding, figureStartPos);
    dragTarget = undefined;

    if (placedFigure) {
      console.log('figures in play:', figures.length);
      const complete = checkLineCompletion(cellsize, padding, figures);

      if (complete) {
        figures = deleteEmptyFigures(figures);
        incrementScore(scoreCounter, complete);
      }

      newRandomFigure({
        pos: figureStartPos,
        shapes,
        setDragTarget,
        app,
        cellsize,
        padding,
        figures,
      });

      const canFit = canFitNewShape({
        figure: figures[figures.length-1],
        figures: figures,
        cellsize,
        padding
      });

      if (!canFit) {
        console.log('SKRIKING');
        gameover(app);
      }

      incrementScore(scoreCounter, 1);
    }
  }
});

// TODO: Resize
renderGrid(gridSize, cellsize, padding, app);
newRandomFigure({
  pos: figureStartPos,
  shapes,
  setDragTarget,
  app,
  cellsize,
  padding,
  figures,
});

gameContainer.appendChild(app.view as HTMLCanvasElement);
console.log('Game JS loaded.');

gameover(app);