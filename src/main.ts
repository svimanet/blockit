console.log('Game JS loading.');

import { newRandomFigure } from './figure/utils';
import { Figure } from './figure/figure';
import { makeShapes } from './figure/shapes';
import { renderGrid } from './utils/grid';
import { Application, Text } from 'pixi.js';
import { gameover } from './utils/gameover';
import { setClickListener, setMoveListener } from './utils/mouseListeners';

const gameContainer = document.getElementById('game') as HTMLDivElement;
let width = gameContainer.clientWidth;
const height = gameContainer.clientHeight;

// Make sure height is up to the task of 175% width.
if (height < width*1.5) width = height / 1.75;

const numCells = 10;
const padding = (width / 100) * 5;
const cellsize = (width - (padding*2)) / 10;
const gridSize = numCells * cellsize;
const canvasWidth = padding + gridSize + padding;
const canvasHeight = canvasWidth*1.5;

let figures: Figure[] = [];
const setFigures = (figs: Figure[]) => { figures = figs };
const shapes = makeShapes(cellsize);
const figureStartPos = {
  x: padding,
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
const setDragTarget = (target: Figure | undefined) => { dragTarget = target };
app.stage.on('pointermove', (e) => setMoveListener(e, dragTarget));
app.stage.on('pointerup', () => {
  setClickListener({
    app, cellsize, padding,
    figureStartPos, figures,
    setFigures, dragTarget,
    setDragTarget, shapes,
  });
});

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

// gameover(app);