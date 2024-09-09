import type { DisplayObject } from "pixi.js";
import { Figure } from "./figure";

export interface GridItem {
  xPos: number; // 0 - (32*10)
  yPos: number; // 0 - (32*10)
  node: DisplayObject;
  figure: Figure;
}

export type GridMap = Map<string, GridItem | undefined>;

export const coordsToString = (x: number, y: number): string => `${x},${y}`;

export const stringToCoords = (str: string): {x: number; y: number}  => {
  try {
    const [x, y] = str.split(',');
    return { x: Number(x), y: Number(y) };
  }
  catch {
    throw new Error(`
      (strinToCoords) Invalid string format for coords.
      Expected: "x,y"
      Received: "${str}"
      `
    );
  }
};

/**
 * Map all figures to a grid map.
 * for each node in the figure, calculate the grid position and store the node in the grid.
 * Used to check for completed lines, and delete nodes and figures when completed.
 * @param figures 
 * @param cellSize 
 * @param numCells 
 * @returns a custom Map type object
 */
export const FiguresToGridMap = (figures: Figure[], cellSize: number, numCells: number): GridMap => {
  const grid: GridMap = new Map();

  for (let x = 0; x < numCells; x++) {
    for (let y = 0; y < numCells; y++) {
      const gridTuple = coordsToString(x, y);
      grid.set(gridTuple, undefined);
    }
  }

  figures.forEach((figure) => {
    figure.container.children.forEach((node) => {
      const nodeBounds = node.getBounds();
      const x = nodeBounds.x;
      const y = nodeBounds.y;
      const gx = Math.floor(x / cellSize);
      const gy = Math.floor(y / cellSize);
      const gridTuple = coordsToString(gx, gy);
      const obj = { xPos: gx, yPos: gy, node, figure};
      grid.set(gridTuple, obj);
    });
  });

  return grid;
};

/**
 * Search for, and delete nodes in grid.
 * @param grid 
 * @param x : All nodes with this X coord will be destroyed
 * @param y : All nodes with this Y coord will be destroyed
 * @returns death and destruction
 */
export const SearchAndDestroy = (grid: GridMap, x?:number, y?:number): void => {
  if (x === undefined && y === undefined) throw new Error(`(SearchAndDestroyComplete) Expected x or y to be defined. Received: ${x}, ${y}`);

  for (let i = 0; i < 10; i++) {
    const xpos = x || i;
    const ypos = y || i;
    const stringCoord = coordsToString(xpos, ypos);
    const node = grid.get(stringCoord)?.node;
    const figure = grid.get(stringCoord)?.figure;
    if (!node || !figure) {
      console.warn('Node not found');
      return;
    }
    console.log('Deleting node', node);
    grid.set(stringCoord, undefined);
    figure.container.removeChild(node);
  }
};