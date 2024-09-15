import type { DisplayObject, Graphics } from "pixi.js";
import type { FigureNode, Figure } from "../types";
import type { Figure as Fig } from "../figure";

/**
 * Check for any horizontal/vertical line completions,
 * delete said completed rows/columns
 * @returns 
 */
export const checkLineCompletion = (
  cellsize: number,
  sidepadding: number,
  figures: Figure[],
): false | number => {
  if (figures.length < 3) return false;

  // TODO: maybe this should be global
  const positions: number[] = [];
  for (let x=0; x<=10; x++) {
    positions.push((cellsize*x));
  }

  const map: {x:number,y:number,node:Graphics}[] = [];
  positions.forEach((x:number, xi:number) => {
    positions.forEach((y:number, yi:number) => {
      figures.forEach((figure) => {
        figure.container.children.forEach((node: Graphics) => {
          const bounds = node.getBounds();
          const xDiff = Math.abs((bounds.x - sidepadding) - x);
          const yDiff = Math.abs((bounds.y - sidepadding) - y);
          if (xDiff < 15 && yDiff < 15) {
            map.push({
              node: node,
              x: xi,
              y: yi,
            })
          }
        });
      });
    });
  });

  const complete: {
    rows:number[],
    cols:number[]
  } = {
    rows:[],
    cols:[]
  };
  const rowsCount: number[] = Array(10).fill(0);
  const colsCount: number[] = Array(10).fill(0);
  map.forEach((m) => {
    rowsCount[m.y]++;
    colsCount[m.x]++;
  });

  rowsCount.forEach((r:number, i:number) => {
    if (r >= 10) { complete.rows.push(i); }
  });
  colsCount.forEach((c:number, i:number) => {
    if (c >= 10) { complete.cols.push(i); }
  });

  let totalLinesComplete = 0;
  const compRows = complete.rows;
  const compCols = complete.cols;
  const crLen = compRows.length;
  const clLen = compCols.length;

  if (crLen > 0 || clLen > 0) {
    totalLinesComplete = clLen + crLen;
    map.forEach((m) => {
      if (compRows.includes(m.y)) {
        m.node.destroy();
      }
      else if (compCols.includes(m.x)) {
        m.node.destroy();
      }
    });
  }
  return totalLinesComplete;
}

/**
 * look through store figures,
 * if they have not childrenn,
 * delete them
 * @param figures 
 */
export const deleteEmptyFigures = (figures: Fig[]): Fig[] => {
  const figs = figures.filter((figure) => {
    const figureChildren = figure.container.children.length;
    if (figureChildren < 1) {
      figure.container.removeChildren();
      figure.container.destroy();
      return false;
    }
    return true;
  });
  return figs;
}

