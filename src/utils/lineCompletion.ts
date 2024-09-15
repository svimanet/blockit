import type { DisplayObject, Graphics } from "pixi.js";
import type { Figure, FigureNode } from "../types";

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
  // let didDestroy = false;


  // /**
  //  * "search" for rectangle coordinates that are within the row grid number.
  //  * If found, add to nodesToDestroy array. 
  //  * @param node 
  //  */
  // const searchAndDestroy = (
  //   node: DisplayObject,
  //   gridPx: number,
  //   inverse?:boolean,
  // ): DisplayObject | undefined => {
  //   const bounds = node.getBounds();
  //   let axis = bounds.y;
  //   if (inverse) axis = bounds.x - sidepadding;

  //   const diff = Math.abs(axis - gridPx);
  //   if (diff < bounds.height*0.25) return node;
  // }

  // TODO: maybe this should be global
  const positions: number[] = [];
  for (let x=0; x<=10; x++) {
    positions.push((cellsize*x));
  }

  const rows: number[] = Array(10).fill(0);
  const cols: number[] = Array(10).fill(0);
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

  console.log('map', map);
  console.log('rowsCount', rowsCount);
  console.log('colsCount', colsCount);
  console.log(complete);
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
    deleteEmptyFigures(figures);
  }

  // // For each figure, ...
  // figures.forEach((figure) => {
  //   // For each rect/"node" in figure, ...
  //   figure.container.children.forEach((node: Graphics) => {
  //     const bounds = node.getBounds();
  //     const { x, y } = bounds;

  //     // Get row and col number of rect, for counting
  //     positions.forEach((pos, i) => {
  //       const xDiff = Math.abs((bounds.x - sidepadding) - pos);
  //       const yDiff = Math.abs((bounds.y - sidepadding) - pos);
  //       if (xDiff < 15) {
  //         cols[i]++;
  //       }
  //       if (yDiff < 15) {
  //         rows[i]++;
  //       }
  //     });
  //   });
  // });

  // console.log('map', map);

  // // complete rows, are rows where thare is a node on each position
  // const completeRows: number[] = [];
  // rows.forEach((row: number, i: number) => {
  //   if (row === 10) completeRows.push(i);
  // });

  // const completeCols: number[] = [];
  // cols.forEach((col: number, i: number) => {
  //   if (col === 10) completeCols.push(i);
  // });

  // console.log('rows', rows);
  // console.log('cols', cols);
  // const totalLinesComplete = completeCols.length + completeRows.length;
  // if (totalLinesComplete === 0) return false;
  // console.log('total lines complete', totalLinesComplete);

  // // const nodesToDestroy: {
  // //   figure: Figure,
  // //   nodes: DisplayObject[],
  // // }[] = [];

  // // Remove complete rows
  // if (completeRows.length > 0) {
  //   // For each of the row nums that are complete,
  //   completeRows.forEach((row) => {

  //     // get the px Y val corner they should all match,
  //     // a complete row implies the all share the same height (y)
  //     const gridPxY = positions[row];

  //     // For each of the figures currently places on map,
  //     figures.forEach((figure: Figure) => {
  //       const nodes = figure.container.children;

  //       nodes.forEach((node: Graphics, i: number) => {
  //         const bounds = node.getBounds();
  //         const { x,y } = bounds;
           

  //         console.group('for each node');
  //         console.log('bounds.y', y);
  //         console.log('bounds.y+padding', y + sidepadding);
  //         console.log('bounds.y-padding', y - sidepadding);
  //         console.log('gridPx', gridPxY);
  //         console.log('gridPx+sidepadding', gridPxY+sidepadding);
  //         console.log('gridPx-sidepadding', gridPxY-sidepadding);
  //         console.log('sidepadding', sidepadding);

  //         const axis = bounds.y - sidepadding;
  //         const diff = Math.abs(axis - gridPxY);
  //         console.log('diff', diff);
  //         console.groupEnd();

  //         // if (bounds.y === gridPxY+sidepadding) {
  //         //   if () {
  //         //   console.log('hit');
  //         // }
  //         // if (bounds.x === gridPx) {
  //         //   didDestroy = true;
  //         //   node.destroy();
  //         // }
  //         // const axis = bounds.y - sidepadding;
  //         // const diff = Math.abs(axis - gridPx);

  //         if (diff < cellsize*0.5) {
  //           // should delete
  //           // didDestroy = true;
  //           node.destroy();
  //         };
  //       });

  //       // // const yNodes = nodes.map((node: DisplayObject) => searchAndDestroy(node, gridPx));
  //       // const xNodes = nodes.map((node: DisplayObject) => searchAndDestroy(node, gridPx));
  //       // const toDestroy = xNodes;
  //       // nodesToDestroy.push({
  //       //   figure,
  //       //   nodes: toDestroy.filter((n: DisplayObject | undefined) => n !== undefined),
  //       // });
  //       // console.log('horizontal nodes to destroy:', nodesToDestroy.length);
  //     });
  //   });
  // }

  // // // Remove complete columns
  // // if (completeCols.length > 0) {
  // //   completeCols.forEach((col) => {
  // //     const gridPy = positions[col];

  // //     figures.forEach((figure) => {
  // //       const nodes = figure.container.children;
  // //       // const yNodes = nodes.map((node: DisplayObject) => searchAndDestroy(node, gridPy));
  // //       const yNodes = nodes.map((node: DisplayObject) => searchAndDestroy(node, gridPy, true));

  // //       const toDestroy = yNodes;
  // //       nodesToDestroy.push({
  // //         figure,
  // //         nodes: toDestroy.filter((n: DisplayObject | undefined) => n !== undefined),
  // //       })
  // //     });
  //   });
  // }

  // console.log(`destroying ${nodesToDestroy.length} nodes`);
  // nodesToDestroy.forEach(des => {
  //   console.log(des);
  //   des.nodes.forEach((node, i) => {
  //     console.log('removing node, ', i);
  //     des.figure.container.removeChild(node);
  //     // des.figure.nodes = des.figure.nodes.filter(n => n !== node)
  //   });
  //   console.log();
  // });
  return totalLinesComplete;
}

/**
 * look through store figures,
 * if they have not childrenn,
 * delete them
 * @param figures 
 */
export const deleteEmptyFigures = (figures: Figure[]): void => {
  const figsToDel: number[] = [];
  console.log('look for empty figs,', figures.length);

  // figures.forEach((figure, i) => {
  //   const figureChildren = figure.container.children.length;
  //   console.log('figure node len:', figureChildren);

  //   if (figureChildren < 1) {
  //     console.log('SHoULD DEL');
  //     figsToDel.push(i);
  //     const fig = figures.splice(i, 1);
  //     if (fig[0]) {
  //       fig[0].container.removeChildren();
  //       fig[0].container.destroy();
  //     }
  //   }
  // });
  // console.log('figs,', figures.length);

  // Clean up figures with less than 1 child
  figures.filter(figure => {
    const figureChildren = figure.container.children.length;
    console.log('figure node len:', figureChildren);

    if (figureChildren < 1) {
      console.log('SHOULD DEL');
      figure.container.removeChildren();
      figure.container.destroy();
      return false; // Do not keep this figure in the array
    }
    return true; // Keep this figure in the array
  });

  // if (figsToDel.length > 0) {
  //   console.log('deleting figs, total:', figures.length);
  //   figsToDel.forEach(i => {
      
  //     const fig = figures.splice(i, 1);
  //     if (fig[0]) {
  //       fig[0].container.removeChildren();
  //       fig[0].container.destroy();
  //     }
  //     else {
  //       console.error('what', fig, figures);
  //     }
  //   });
  //   console.log('deleted figs, new total:,', figures.length);
  // }
}

