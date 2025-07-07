import type { DisplayObject } from "pixi.js";
import type { Figure } from "../figure/figure";

/**
* Check for any horizontal/vertical line completions,
* delete said completed rows/columns
* @returns 
*/
export const checkLineCompletion = (
  cellsize: number,
  padding: number,
  figures: Figure[],
  grid: number[][],
): {
  nodesToDel: undefined | DisplayObject[],
} => {

  // Skip checks if less than 3 figures to check
  if (figures.length < 3) {
    return ({ 
      nodesToDel: undefined,
    });
  }

  // Find complete rows ..
  const completeRows: number[] = [];
  grid.forEach((row, y) => {
    const completeRow = !row.includes(0);
    if (completeRow) completeRows.push(y);
  });

  // Find complete cols ..
  const completeCols: number[] = [];
  grid.forEach((_row, i) => {
    let completeCol = true;
    grid.forEach((rrow, j) => {
      if (grid[j][i] === 0) {
        completeCol = false;
      }
    });

    if (completeCol) {
      completeCols.push(i);
    }
  });

  // Map nodes from completed lines, to delete after
  const nodesToDel: DisplayObject[] = [];
  figures.forEach((fig) => {
    fig.container.children.forEach((node: DisplayObject) => {
      const bounds = node.getBounds();
      const x = Math.round((bounds.left - padding)/cellsize);
      const y = Math.round((bounds.top - padding)/cellsize);

      if (completeRows.includes(y) || completeCols.includes(x)) {
        nodesToDel.push(node);
      }
    });
  });

  return ({nodesToDel});
}

/*
  Delete a single figure-node, with delay.
  Activated when a horizontal/vertical line is filled.
  Delay for animation effect.
*/
export const deleteNode = async (node: DisplayObject) => {
  await new Promise(resolve => setTimeout(resolve, 50))
  .then(() => {
    node.removeFromParent();
    node.removeAllListeners();
    node.destroy();
  });
};