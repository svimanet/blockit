import { Figure } from './figure';
import { Application, DisplayObject, FederatedPointerEvent, Graphics } from 'pixi.js';
import { makeShapes, randomShape } from './utils';
import { checkLineCompletion, deleteEmptyFigures } from './utils/lineCompletion';

console.log('Game JS loading.');


/**
 * Generate new figure to start with
 */
const newFigure = (startpos:{x:number,y:number}) => {
  const { x, y } = startpos;
  const shape = randomShape();
  const setter = setDragTarget;
  const figure = new Figure(shape, setter, app, cellSize, sidepadding, shapes);
  // Position it below grid (pluss padding)
  figure.setPos(x,y);
  figures.push(figure);
}

/**
 * Render a black line grid for user experience.
 */
const renderGrid = (
  gridsize: number,
  cellsize: number,
  sidepadding: number,
) => {
  const grid = new Graphics();
  grid.lineStyle(2, 0x000000, 1);
  for (let i = 0; i < numCells + 1; i++) {
    grid.moveTo(i * cellsize + sidepadding, sidepadding);
    grid.lineTo(i * cellsize + sidepadding, gridsize + sidepadding);
    grid.moveTo(sidepadding, i * cellsize + sidepadding);
    grid.lineTo(gridsize + sidepadding, i * cellsize + sidepadding);
  }
  app.stage.addChild(grid);
};

const incrementScore = (element: HTMLSpanElement, n:number): void => {
  const val = Number(element.innerText);
  const total: number = val + n;
  element.innerText = String(total);
};

/* ---------------------------------------------------------------- */
/* RUNTIME STUFFS                                                   */
/* ---------------------------------------------------------------- */

const gameContainer = document.getElementById('game') as HTMLDivElement;
const scoreCounter = document.getElementById('score') as HTMLSpanElement;

let width = gameContainer.clientWidth;
const height = gameContainer.clientHeight;

// Make sure height is up to the task of 150% width.
if (height < width*1.5) {
  width = height / 1.5;
}

const sidepadding = (width / 100) * 5; // 5% on both sides
const dynamicCellSize = (width - (sidepadding*2)) / 10;

const app = new Application({
  background: '#333333',
  resizeTo: window
});
app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

const numCells = 10;
const cellSize = dynamicCellSize;
const gridSize = numCells * cellSize;
const figureStartPos = {
  x: sidepadding, // TODO more dynamic x pos i guess
  y:(cellSize*10)+(sidepadding*2)
};

const shapes = makeShapes(cellSize);
let figures: Figure[] = [];

// Target getter and setter for mouse event. Only one at a time on global scope.
// Setter supplied to Figure constructor for container onclick target switching.
let dragTarget: Figure | undefined; 
const setDragTarget = (target: Figure) => dragTarget = target;

app.stage.on('pointermove', (e: FederatedPointerEvent) => {
  if (dragTarget) {
    dragTarget.move(e);
  }
});

/* Clear dragTarget whenever mousebutton is released in app. */
app.stage.on('pointerup', () => {
  if (dragTarget) {
    const moved = dragTarget.stopMoving(figures, cellSize, sidepadding, figureStartPos);
    dragTarget = undefined;
    if (moved) {
      console.log('figs:', figures.length);
      const complete = checkLineCompletion(cellSize, sidepadding, figures);
      if (complete) {
        figures = deleteEmptyFigures(figures);
        incrementScore(scoreCounter, complete);
      }
      newFigure(figureStartPos);
      incrementScore(scoreCounter, 1);
    }
  }
});

// TODO: Resize
renderGrid(
  gridSize,
  cellSize,
  sidepadding
);

newFigure(figureStartPos);

gameContainer.appendChild(app.view as HTMLCanvasElement);

console.log('Game JS loaded.');