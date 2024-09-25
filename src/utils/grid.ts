import { Application, Graphics } from "pixi.js";

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
    // draw line to same width (x), but max height (y).
    // Increment x (width) for each
    grid.moveTo(((i*cellsize) + padding), padding);
    grid.lineTo(((i*cellsize) + padding), (gridsize + padding));
    // Rows. Start at top left corner,
    // draw line to same height (y), but max width (x).
    // Increment y (height) for each
    grid.moveTo(padding, ((i*cellsize) + padding));
    grid.lineTo((padding + (10*cellsize)) ,((i*cellsize) + padding));
  }
  app.stage.addChild(grid);
};
