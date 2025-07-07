import { newRandomFigure } from './figure/utils';
import { Figure } from './figure/figure';
import { makeShapes } from './figure/shapes';
import { renderGrid } from './utils/grid';
import { Application } from 'pixi.js';
import { setPointerReleaseListener, setMoveListener } from './utils/mouseListeners';
import { hiscoresStorageSetup } from './../hiscores';

const gameContainer = document.getElementById('game') as HTMLDivElement;
let width = gameContainer.clientWidth;

const padding = (width / 100) * 5;
const numCells = 10;
const cellsize = (width - (padding*2)) / 10;
const gridSize = numCells * cellsize;
const canvasWidth = padding + gridSize + padding;
const canvasHeight = canvasWidth*1.5;

let figures: Figure[] = [];
const getFigures = () => figures;
const setFigures = (figs: Figure[]) => { figures = figs };

let nextFigure: Figure;
const setNextFigure = (f: Figure) => nextFigure = f;
const getNextFigure = () => (nextFigure);

const shapes = makeShapes(cellsize);
const getShapes = () => shapes;

const figureStartPos = {
  x: padding,
  y: (cellsize*10)+(padding*2)
};

const nextFigureIndicatorPos = {
  x: (padding + (cellsize*4) + padding),
  y: (cellsize*10)+(padding*2)
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
    app,
    cellsize,
    padding,
    figureStartPos,
    nextFigureIndicatorPos,
    getFigures,
    setFigures,
    dragTarget,
    setDragTarget,
    getShapes,
    getNextFigure,
    setNextFigure
  });
});

renderGrid(gridSize, cellsize, padding, app);
hiscoresStorageSetup();

// Generate the first figure directly into the all-figures-setter.
setFigures([
  newRandomFigure({
    pos: figureStartPos,
    getShapes,
    setDragTarget,
    app,
    cellsize,
    padding,
  })
]);

// Generate the "next" figure directly into its own setter.
setNextFigure(
  newRandomFigure({
    pos: nextFigureIndicatorPos,
    getShapes,
    setDragTarget,
    app,
    cellsize,
    padding,
    isNext: true,
  })
);

gameContainer.appendChild(app.view as HTMLCanvasElement);

