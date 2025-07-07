
import type { Application } from "pixi.js";
import { Figure } from "./figure";
import type { Shape, FigureNode } from '../types';
import { randomShape } from "./shapes";

/**
 * Generate new figure to start with.
 */
export const newRandomFigure = (props: {
  getShapes: () => Record<Shape, FigureNode[]>;
  setDragTarget: (target: Figure | undefined) => void;
  app: Application;
  cellsize: number;
  padding: number;
  pos: { x: number; y: number; };
  isNext?: boolean;
  nextIndicatorPos?: { x: number; y: number; };
}) => {
  const {
    pos,
    getShapes,
    setDragTarget,
    app,
    cellsize,
    padding,
    isNext
  } = props;

  const { x, y } = pos;
  const shape = randomShape(getShapes());
  const setter = setDragTarget;

  const figure = new Figure(
    shape,
    setter,
    app,
    cellsize,
    padding,
    getShapes,
    isNext
  );

  figure.setPos(x,y);
  return figure;
}

export const newFigureFromShape = (props: {
  getShapes: () => Record<Shape, FigureNode[]>;
  setDragTarget: (target: Figure | undefined) => void;
  app: Application;
  cellsize: number;
  shape: Shape;
  padding: number;
  pos: {
    x: number;
    y: number;
  };
}) => {
  const {
    pos,
    getShapes,
    setDragTarget,
    app,
    cellsize,
    padding,
    shape
  } = props;

  const { x, y } = pos;
  const setter = setDragTarget;

  const figure = new Figure(
    shape,
    setter,
    app,
    cellsize,
    padding,
    getShapes,
  );

  figure.setPos(x,y);
  return figure;
};


/**
 * check if a fig fits in a certain grid pos.
 * For every node in the figure,
 * add x and y offset,
 * then check if the node is oob, if so RETURN null
 * or if the node is ontop of existing. if so RETURN false
 * if none of the above, RETURN true, can fit.
 * @param props 
 * @returns true if fits, false if not, null if OOB.
 */
const figureFitsAtPos = (props: {
  figure: {x:number, y:number}[];
  grid: number[][];
  x: number;
  y: number;
}): boolean | null => {
  let canFit: boolean | null  = true;
  const { figure, grid, x, y } = props;

  for (let i=0; i<figure.length; i++) {
    const node = figure[i];
    const nodeX = (node.x + x);
    const nodeY = (node.y + y);

    if ( // Is Out of Bouds (OOB)
      nodeX < 0 || nodeY < 0
      || nodeX >= grid.length
      || nodeY >= grid.length
    ) {
      canFit = null;
      break;
    }

    // Is overlapping existing
    const doesOverlap = grid[nodeY][nodeX] === 1;
    if (doesOverlap) {
      canFit = false;
      break;
    }
  };

  // If not OOB or overlapping, then i sits
  return canFit;
};


/**
 * Check if the grid can fit the next figure to place.
 * If not, the game ends.
 */
export const isRoomForNewFigureInGrid = (prpos: {
  figure: Figure;
  cellsize: number;
  padding: number;
  grid: number[][];
}) => {
  const {
    figure,
    cellsize,
    padding,
    grid
  } = prpos;

  // Make simpler representation of the figure we are checking
  let simplefigure:{x:number,y:number}[] = [];
  figure.container.children.forEach((node) => {
    const bounds = node.getBounds();
    const x = Math.round((bounds.left - padding)/cellsize);
    const y = Math.round((bounds.top - padding)/cellsize);
    simplefigure.push({x,y});
  });

  // account for Y offset (new figs are place below grid).
  // Find lowest Y, set it to zero, and subtract it from the rest,
  const simpleYs = [...simplefigure].map(sf => sf.y);
  const lowestY = Math.min(...simpleYs);
  // then do the same for X
  const simpleXs = [...simplefigure].map(sf => sf.x);
  const lowestX = Math.min(...simpleXs);
  // then subtract the lowest val from each coord in each node
  simplefigure = [...simplefigure].map(sf => ({
    x: sf.x - lowestX, y: sf.y - lowestY
  }));

  let falses = 0;
  let truths = 0;
  let oobs = 0;

  // grid[][] - outer/root list = rows, height, y
  for (let y=0; y<10; y++) {
    // For every row 
    for (let x=0; x<10; x++) {

      const canfit = figureFitsAtPos({
        figure: simplefigure,
        grid, x, y
      });

      if (canfit) {
        truths += 1;
      }
      else if (canfit === null) {
        oobs += 1;
      }
      else {
        falses += 1;
      }
    }
  }

  return truths > 0;
}
