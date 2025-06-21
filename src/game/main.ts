import { newRandomFigure } from './figure/utils';
import { Figure } from './figure/figure';
import { makeShapes } from './figure/shapes';
import { renderGrid } from './utils/grid';
import { Application, Text } from 'pixi.js';
import { setPointerReleaseListener, setMoveListener } from './utils/mouseListeners';
import { hiscoresStorageSetup } from './../hiscores';

const gameContainer = document.getElementById('game') as HTMLDivElement;
let width = gameContainer.clientWidth;
const height = gameContainer.clientHeight;

const numCells = 10;
const padding = (width / 100) * 5;
const cellsize = (width - (padding*2)) / 10;
const gridSize = numCells * cellsize;
const canvasWidth = padding + gridSize + padding;
const canvasHeight = canvasWidth*1.5;

let figures: Figure[] = [];
const getFigures = () => figures;
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
  resizeTo: gameContainer
});
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

// Target getter and setter for mouse event. Only one at a time on global scope.
// Setter supplied to Figure constructor for container onclick target switching.
let dragTarget: Figure | undefined; 
const setDragTarget = (target: Figure | undefined) => { dragTarget = target };
app.stage.on('pointermove', (e) => setMoveListener(e, dragTarget));
app.stage.on('pointerup', () => {
  setPointerReleaseListener({
    app, cellsize, padding,
    figureStartPos, getFigures,
    setFigures, dragTarget,
    setDragTarget, shapes,
  });
});

renderGrid(gridSize, cellsize, padding, app);
const firstFig = newRandomFigure({
  pos: figureStartPos,
  shapes,
  setDragTarget,
  app,
  cellsize,
  padding,
});

hiscoresStorageSetup();

setFigures([firstFig]);

gameContainer.appendChild(app.view as HTMLCanvasElement);

