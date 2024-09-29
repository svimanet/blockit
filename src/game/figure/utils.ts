
import type { Application } from "pixi.js";
import { Figure } from "./figure";
import type { Shape, FigureNode } from '../types';
import { canFitI2, randomShape } from "./shapes";

interface nRFProps {
  shapes: Record<Shape, FigureNode[]>;
  setDragTarget: (target: Figure | undefined) => void;
  app: Application;
  cellsize: number;
  padding: number;
  // figures: Figure[];
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
    // figures
  } = props;
  const { x, y } = pos;
  const shape = randomShape(shapes);
  const setter = setDragTarget;
  const figure = new Figure(shape, setter, app, cellsize, padding, shapes);
  figure.setPos(x,y);
  return figure;
  // figures.push(figure);
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
export function prettyPrintGrid(grid: Array<Array<number>>) {
  grid.forEach((row, i) => {
    let rowStr = `${i}: `;
    row.forEach(col => {
      rowStr += `${col} `;
    });
    console.log(rowStr);
  });
};


interface canFitNewShapeProps {
  figure: Figure;
  figures: Figure[];
  cellsize: number;
  padding: number;
}


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
  if (figs.length < 3) return true;

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

  const binaryFigureNodes:{x:number,y:number}[] = [];
  figure.container.children.forEach((node) => {
    const bounds = node.getBounds();
    const x = Math.round((bounds.left - padding)/cellsize);
    const y = Math.round((bounds.top - padding)/cellsize);
    binaryFigureNodes.push({x,y});
  });

  const bx: number[] = binaryFigureNodes.map(b => b.x);
  const by = binaryFigureNodes.map(b => b.y);
  const lowX = Math.min(...bx);
  const lowY = Math.min(...by);
  const lowXdiff = Math.round(Math.abs(lowX - 0));
  const lowYdiff = Math.round(Math.abs(lowY - 0));

  binaryFigureNodes.forEach((b) => {
    b.x -= lowXdiff;
    b.y -= lowYdiff
  });

  // Assume figure can fit unless proven otherwise
  let canFit = true;

  for (let x=0; x<10; x++) {
    binaryFigureNodes.forEach(b => {b.x += 1;});
    for (let y=0; y<10; y++) {
      binaryFigureNodes.forEach(b => {b.y += 1;});

      // Check if placing the figure at (gridX, gridY) is possible
      for (let i = 0; i < binaryFigureNodes.length; i++) {
        const nodeX = binaryFigureNodes[i].x + x;
        const nodeY = binaryFigureNodes[i].y + y;

        // Check if node is out of grid bounds
        if (nodeX < 0 || nodeX >= grid.length || nodeY < 0 || nodeY >= grid[0].length) {
          canFit = false; // Figure goes out of bounds
          break;
        }

        // Check if the grid cell is occupied by an existing figure
        if (grid[nodeY][nodeX] !== 0) {
          canFit = false; // Figure overlaps with existing one
          break;
        }
        canFit = true;
      }

      // If the figure can fit in this position, return true
      if (canFit) {
        return true;
      }
    }

    // Reset positions for next rox
    const bx: number[] = binaryFigureNodes.map(b => b.x);
    const by = binaryFigureNodes.map(b => b.y);
    const lowX = Math.min(...bx);
    const lowY = Math.min(...by);
    const lowXdiff = Math.round(Math.abs(lowX - 0));
    const lowYdiff = Math.round(Math.abs(lowY - 0));

    binaryFigureNodes.forEach((b) => {
      b.x -= lowXdiff;
      b.y -= lowYdiff
    });
  }

  return canFit;
}