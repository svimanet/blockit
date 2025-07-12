import { Application, DisplayObject, Graphics } from "pixi.js";
import type { Figure } from "./types";

/**
 * Render a black line grid for user experience.
 */
export const renderGrid = (
  gridsize: number,
  cellsize: number,
  padding: number,
  app: Application,
): void => {
  const grid = new Graphics();
  grid.lineStyle(2, 0x000000, 1);
  for (let i = 0; i < 10 + 1; i++) {
    // Columns. From top left corner,
    grid.moveTo(((i*cellsize) + padding), padding);
    grid.lineTo(((i*cellsize) + padding), (gridsize + padding));
    // Rows. Start at top left corner,
    grid.moveTo(padding, ((i*cellsize) + padding));
    grid.lineTo((padding + (10*cellsize)) ,((i*cellsize) + padding));
  }
  app.stage.addChild(grid);
};

/**
* Make, populate, and return,
* a 2D representation of the map as a grid.
* Used for various placement checking.
* @param props 
* @returns 
*/
export const makeGrid = (props: {
  getFigures: () => Figure[];
  cellsize: number;
  padding: number;
}): number[][] => {
  const { getFigures, cellsize, padding } = props;
  const grid: number[][] = [];
  const numCellsInGrid = 10;
  for(let x=0; x<numCellsInGrid; x++) {
    const row = [];
    for(let y=0; y<numCellsInGrid; y++) {
      row.push(0);
    }
    grid.push(row);
  }

  getFigures().forEach(fig => {
    fig.container.children.forEach((node: DisplayObject) => {
      const bounds = node.getBounds();
      const x = Math.round((bounds.left - padding)/cellsize);
      const y = Math.round((bounds.top - padding)/cellsize);
      grid[y][x] = 1;
    });
  });

  return grid;
};