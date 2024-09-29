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
  completed: false | number,
  figures: Figure[]
} => {
  if (figures.length < 3) {
    return { completed: false, figures };
  }

  const completeRows: number[] = [];
  grid.forEach((row, y) => {
    const completeRow = !row.includes(0);
    if (completeRow) completeRows.push(y);
  });

  const completeCols: number[] = [];
  grid.forEach((row, i) => {
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

  const figuresToDel: {fig:Figure,i:number}[] = [];
  figures.forEach((fig, i) => {
    const nodesToDel: DisplayObject[] = [];

    fig.container.children.forEach((node: DisplayObject, i:number) => {
      const bounds = node.getBounds();
      const x = Math.round((bounds.left - padding)/cellsize);
      const y = Math.round((bounds.top - padding)/cellsize);

      if (completeRows.includes(y) || completeCols.includes(x)) {
        nodesToDel.push(node);
      }
    });

    nodesToDel.forEach((node) => {
      node.removeFromParent();
      node.removeAllListeners();
      node.destroy();
    });

    if (fig.container.children.length === 0) {
      figuresToDel.push({fig, i});
    }
  });

  let newfigures:Array<Figure|undefined> = figures;
  figuresToDel.forEach(({ fig, i }) => {
    fig.container.removeAllListeners();
    fig.container.removeChildren();
    fig.container.destroy();
    newfigures[i] = undefined;
  });

  const finalFigures: Figure[] = newfigures.filter(f => f !== undefined);

  return ({
    completed: (completeRows.length + completeCols.length),
    figures: finalFigures
  });
}
