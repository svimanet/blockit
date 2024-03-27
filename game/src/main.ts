import { Figure } from './figure';
import { Application, DisplayObject, FederatedPointerEvent, Graphics } from 'pixi.js';
import { randomShape } from './utils';

console.log('Game JS loading.');

const app = new Application({
  background: '#333333',
  width: 32*10,
  height: 32*15,
});

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

document.getElementById('game')?.appendChild(app.view as HTMLCanvasElement);

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
  if (figures.length < 3) return;

  const rows: Record<number, number> = {};
  const cols: Record<number, number> = {};

  // For each figure's node, ...
  figures.forEach((figure) => {
    figure.container.children.forEach((node: DisplayObject) => {
      const nodeBounds = node.getBounds();
      const x = nodeBounds.x;
      const y = nodeBounds.y;
      // Increment all nodes on each x and y position, for counting later
      rows[y] ? rows[y] += 1 : rows[y] = 1;
      cols[x] ? cols[x] += 1 : cols[x] = 1;
    });
  });

  // Rows and cols with 10 nodes are mared for destruction
  const ydel: number[] = [];
  const xdel: number[] = [];
  Object.entries(rows).forEach(([key, value]) => {
    if (value === 10) ydel.push(Number(key));
  });
  Object.entries(cols).forEach(([key, value]) => {
    if (value === 10) xdel.push(Number(key));
  });

  // For each figure, ...
  figures.forEach((figure: Figure) => {
    const nodesToDestroy: DisplayObject[] = [];

    // For each node in figure, ...
    figure.container.children.forEach((node) => {
      const nodeBounds = node.getBounds();
      const x = nodeBounds.x;
      const y = nodeBounds.y;

      // Mark for destruction, if coords in pre-made destroy lists
      if (ydel.includes(y) || xdel.includes(x)) {
        nodesToDestroy.push(node);
      }
    });

    // Destroy the children
    nodesToDestroy.forEach((node) => (
      figure.container.removeChild(node)
    ));

    // If figure is empty, remove it from figures array and stage.
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