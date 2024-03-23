import { Figure } from './figure';
import { Application, DisplayObject, FederatedPointerEvent, Graphics } from 'pixi.js';
import { grid64, randomShape } from './utils';

console.log('Game JS loading.');

const app = new Application({
  background: '#333333',
  resizeTo: window,
});

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;

document.body.appendChild(app.view as HTMLCanvasElement);

const numCells = 10;
const cellSize = 32;
const gridSize = numCells * cellSize;

let widthDiff = window.innerWidth - gridSize;
let xpadding = widthDiff / 2;
let ypadding = 200;

const renderGrid = () => {
  const grid = new Graphics();
  grid.lineStyle(2, 0x000000, 1);
  for (let i = 0; i < numCells + 1; i++) {
    grid.moveTo(i * cellSize + xpadding, ypadding);
    grid.lineTo(i * cellSize + xpadding, gridSize + ypadding);
    grid.moveTo(xpadding, i * cellSize + ypadding);
    grid.lineTo(gridSize + xpadding, i * cellSize + ypadding);
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
    figure.container.children.forEach((node) => {
      const bounds = node.getBounds();
      const x = Math.round(bounds.x);
      const y = Math.round(bounds.y);

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
      const bounds = node.getBounds();
      const x = Math.round(bounds.x);
      const y = Math.round(bounds.y);

      // Mark for destruction, if coords in pre-made destroy lists
      if (ydel.includes(y) || xdel.includes(x)) {
        console.log('destroying node');
        nodesToDestroy.push(node);
      }
    });

    // Finally, destroy the children
    nodesToDestroy.forEach((node) => (
      figure.container.removeChild(node)
    ));
  });
}

const newFigure = () => {
  const shape = randomShape();
  const setter = setDragTarget;
  const figure = new Figure(shape, setter, app, cellSize);
  figure.setPos(0, -192);
  figures.push(figure);
}

const generateFullRowOfFigures = (offset?: number) => {
  const figure1 = new Figure('I', setDragTarget, app, cellSize);
  figure1.setPos(0, 64+(offset || 0));
  figures.push(figure1);
  const figure2 = new Figure('I', setDragTarget, app, cellSize);
  figure2.setPos(128, 64+(offset || 0));
  figures.push(figure2);
  const figure3 = new Figure('O', setDragTarget, app, cellSize);
  figure3.setPos(256, 64+(offset || 0));
  figures.push(figure3);
}

newFigure();
generateFullRowOfFigures();
generateFullRowOfFigures(64);

console.log('Game JS loaded.');