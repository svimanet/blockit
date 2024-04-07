import { Figure } from './figure';
import { Application, DisplayObject, FederatedPointerEvent, Graphics } from 'pixi.js';
import { randomShape } from './utils';
import { coordsToString, stringToCoords, type GridItem, type GridMap, FiguresToGridMap, SearchAndDestroy } from './lineCompletion';

console.log('Game JS loading.');

const app = new Application({
  background: '#333333',
  width: 32*10,
  height: 32*15,
});

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

document.getElementById('game')?.appendChild(app.view as HTMLCanvasElement);

const incrementScore = (increment?: number) => {
  const scoreInput = document.getElementById('score') as HTMLInputElement

  let score = Number(scoreInput.value);
  if (isNaN(score)) {
    score = 0;
  }
  else {
    score += increment || 1;
  }

  scoreInput.value = String(score);
};

const numCells = 10;
const cellSize = 32;
const gridSize = numCells * cellSize;

const renderGrid = () => {
  const grid = new Graphics();
  grid.lineStyle(2, 0x000000, 1);
  for (let i = 0; i < numCells + 1; i++) {
    grid.moveTo(i * cellSize, 0);
    grid.lineTo(i * cellSize, gridSize);
    grid.moveTo(0, i * cellSize);
    grid.lineTo(gridSize, i * cellSize);
  }
  app.stage.addChild(grid);
};

// TODO: Resize
renderGrid();

const figures = Array<Figure>();

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
    const moved = dragTarget.stopMoving(figures);
    dragTarget = undefined;
    if (moved) {
      checkLineCompletion();
      newFigure();
      // TODO: Check for game over
    }
  }
});

/**
 * Check for completed lines and destroy them.
 * @returns 
 */
const checkLineCompletion = () => {
  // Lag grid map over nodes, med attached figure.
  const grid: GridMap = FiguresToGridMap(figures, cellSize, numCells);

  // Count complete rows/cols
  const xMap = new Map<number, number>();
  const yMap = new Map<number, number>();
  grid.forEach((value, key) => {
    if (!value) return;
    const tupl = stringToCoords(key);
    const { x, y } = tupl;
    xMap.set(x, (xMap.get(x) || 0) + 1);
    yMap.set(y, (yMap.get(y) || 0) + 1);
  });

  // Find complete rows/cols
  const completeX: number[] = [];
  xMap.forEach((value, key) => {
    if (value === numCells) completeX.push(key);
  });

  const completeY: number[] = [];
  yMap.forEach((value, key) => {
    if (value === numCells) completeY.push(key);
  });

  // Delete nodes on completed rows/cols
  completeX.forEach((x) => SearchAndDestroy(grid, x, undefined));
  completeY.forEach((y) => SearchAndDestroy(grid, undefined, y));

  // Destroy figures with no children
  figures.forEach((figure) => {
    if (figure.container.children.length === 0) {
      app.stage.removeChild(figure.container);
      figures.splice(figures.indexOf(figure), 1);
    }
  });
}

const newFigure = () => {
  const shape = randomShape();
  const setter = setDragTarget;
  const figure = new Figure(shape, setter, app, cellSize);
  figure.setPos(32*3, 32*10+10);
  figures.push(figure);

  // For every figure placed, we give a POINT.
  incrementScore();
}

const generateInitialTestingFigures = (offset?: number) => {
  const figure1 = new Figure('I', setDragTarget, app, cellSize);
  figure1.setPos(0, 64+(offset || 0));
  figure1.container.eventMode = 'none';
  figures.push(figure1);
};

newFigure();

// For testing. TODO: Remove
generateInitialTestingFigures();

console.log('Game JS loaded.');
