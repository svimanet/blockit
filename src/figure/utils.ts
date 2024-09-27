
import type { Application } from "pixi.js";
import { Figure } from "./figure";
import type { Shape, FigureNode } from '../types';
import { canFitI2, randomShape } from "./shapes";

interface nRFProps {
  shapes: Record<Shape, FigureNode[]>;
  setDragTarget: (target: Figure) => Figure;
  app: Application;
  cellsize: number;
  padding: number;
  figures: Figure[];
  pos: {
    x: number;
    y: number;
  };
}

/**
 * Generate new figure to start with
 */
export const newRandomFigure = (props: nRFProps) => {
  const {
    pos,
    shapes,
    setDragTarget,
    app,
    cellsize,
    padding,
    figures
  } = props;
  const { x, y } = pos;
  const shape = randomShape(shapes);
  const setter = setDragTarget;
  const figure = new Figure('I2', setter, app, cellsize, padding, shapes);
  figure.setPos(x,y);
  figures.push(figure);
}

interface canFitNewShapeProps {
  figure: Figure;
  figures: Figure[];
  cellsize: number;
  padding: number;
}

const collision = (figures: Figure[], figure: Figure): boolean => {
  // For each other figure, check for collision
  const figs = [...figures];
  figs.pop();
  return figs.some((fig) => {

    // For each rect in This figure
    return fig.container.children.some((node) => {

      // For each rect in other fiure
      return figure.container.children.some((otherNode) => {

        // If a node in this figure collides with a node in the other figure, return true (Collides)
        if (node.getBounds().intersects(otherNode.getBounds())) {
          return true;
        }
        return false;
      });
    });
  });
}

// Pretty print the grid
function prettyPrintGrid(grid: Array<Array<number>>) {
  grid.forEach((row, i) => {
    let rowStr = `${i}: `;
    row.forEach(col => {
      rowStr += `${col} `;
    });
    console.log(rowStr);
  });
};



/**
 * Check if the grid can fit the next figure to place.
 * If not, the game ends.
 */
export const canFitNewShape = (prpos: canFitNewShapeProps) => {
  const {
    figure,
    figures: figs,
    cellsize,
    padding
  } = prpos;

  const figures = [...figs];
  figures.pop();
  const shape = figure.shape;
  const criteria = [];
  const grid: number[][] = [];
  for(let x=0; x<10; x++) {
    const row = [];
    for(let y=0; y< 10; y++) {
      row.push(0);
    }
    grid.push(row);
  }

  figures.forEach(fig => {
    fig.container.children.forEach((node) => {
      const bounds = node.getBounds();
      const x = Math.round((bounds.left - padding)/cellsize);
      const y = Math.round((bounds.top - padding)/cellsize);
      grid[y][x] = 1;
    });
  });

  prettyPrintGrid(grid);

  if (shape === 'I2') {
    criteria.push(canFitI2(grid));
  }
 
  const isSuccess = !criteria.includes(false);
  return isSuccess;
}