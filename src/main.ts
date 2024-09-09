import {
  Application,
  FederatedPointerEvent,
  Graphics
} from 'pixi.js';

import type { GridMap } from './lineCompletion';
import { Figure } from './figure';
import { randomShape } from './utils';
import {
  stringToCoords,
  FiguresToGridMap,
  SearchAndDestroy
} from './lineCompletion';

// Default to mobile min-width
const width = window.innerWidth || 320;
// Default to 150% (1.5 times) of width
let height = width * 1.5;
let app: Application;

try {
  const gameContainer = document.getElementById('game') as HTMLDivElement;
  height = gameContainer.clientHeight;
  app = new Application({
    background: '#333333',
    width,
    height,
  });

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  gameContainer.appendChild(app.view as HTMLCanvasElement);
  console.log('Successfully attached game window');
}
catch (err) {
  console.error('Failed at something. Idk. Here\'s a clue:', err);
  throw err;
}

const incrementScore = (increment?: number) => {
  const scoreInput = document.getElementById('score') as HTMLSpanElement;

  let score = Number(scoreInput.innerText);
  if (isNaN(score)) {
    score = 0;
  }
  else {
    score += increment || 1;
  }

  scoreInput.innerText = String(score);
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

export const start = () => {
  // TODO: Resize
  renderGrid();
  newFigure();
  // For testing. TODO: Remove
  generateInitialTestingFigures();
};

console.log('Game JS Initialized OK.');

start();