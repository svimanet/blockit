import type { Application, DisplayObject, FederatedPointerEvent } from "pixi.js";
import type { Figure } from "../figure/figure";
import { checkLineCompletion } from "./lineCompletion";
import { incrementScore } from "./score";
import { isRoomForNewFigureInGrid, newRandomFigure,  } from "../figure/utils";
import type { FigureNode, Shape } from "../types";
import { gameover } from "./gameover";

export const setMoveListener = (e: FederatedPointerEvent, dragTarget: Figure | undefined) => {
  if (dragTarget) dragTarget.move(e);
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
  for(let x=0; x<10; x++) {
    const row = [];
    for(let y=0; y< 10; y++) {
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

interface ClickProps {
  app: Application;
  cellsize: number;
  padding: number;
  figureStartPos: {x:number, y:number};
  getFigures: () => Figure[];
  setFigures: (figs: Figure[]) => void;
  dragTarget: Figure | undefined;
  setDragTarget: (fig: Figure|undefined) => void;
  shapes: Record<Shape, FigureNode[]>;
}

/**
 * Do all of the stuffs when releasing mouse pointer,
 * only if we actually have a drag target.
 * Most of the following checks require at least some figs.
 * @param props D
 */
export const setPointerReleaseListener = async (props: ClickProps) => {
  const {
    app, cellsize, padding,
    figureStartPos, getFigures,
    dragTarget, setDragTarget,
    setFigures, shapes
  } = props;

  /* Clear dragTarget whenever mousebutton is released in app. */
  if (dragTarget) {
    setDragTarget(undefined);
    const placedFigure = dragTarget.stopMoving(
      getFigures(),
      cellsize,
      padding,
      figureStartPos
    );

    // If we actually manage to place anything
    if (placedFigure) {
      let grid = makeGrid({
        getFigures,
        cellsize,
        padding
      });


      // Check for any complete vertical/horizontal lines ..
      const figures = getFigures();
      const complete = checkLineCompletion(
        cellsize,
        padding,
        figures,
        grid
      );

      // Delte node, with delay. Used for animation when deleting lines.
      const deleteNode = async (node: DisplayObject) => {
        await new Promise(resolve => setTimeout(resolve, 50))
        .then(() => {
          node.removeFromParent();
          node.removeAllListeners();
          node.destroy();
        });
      };

      // If any completed lines, we should also have nodes to delete.
      if (complete.nodesToDel && complete.nodesToDel.length > 0) {
        // await complete.nodesToDel.forEach(async (node) => {
        for (const [i, node] of complete.nodesToDel.entries()) {
          await deleteNode(node);
        };

        // For all figures again, check if any of them are now empty
        const figuresToDel: { fig:Figure, i:number }[] = [];
        figures.forEach((fig, i) => {
          if (fig.container.children.length === 0) {
            figuresToDel.push({fig, i});
          }
        });

        // Then delete figures, and replace with undefined, to not fucking js array order
        let newfigures:Array<Figure|undefined> = figures;
        figuresToDel.forEach(({ fig, i }) => {
          fig.container.removeAllListeners();
          fig.container.removeChildren();
          fig.container.destroy();
          newfigures[i] = undefined;
        });
        const finalFigures: Figure[] = newfigures.filter(f => f !== undefined);
        setFigures(finalFigures);

        // Increment score only if a line is complete. Modify score for each line.
        let score = complete.nodesToDel.length;
        let modifier = Math.round(score/10);
        incrementScore(score * modifier);
      };

      // New Figure generation, ready to place a new one.
      const newFig = newRandomFigure({
        pos: figureStartPos,
        shapes,
        setDragTarget,
        app,
        cellsize,
        padding,
      });

      // Re-make grid after deleting shit.
      grid = makeGrid({
        getFigures,
        cellsize,
        padding
      });

      const roomInGrid = isRoomForNewFigureInGrid({
        figure: newFig,
        cellsize,
        padding,
        grid
      });

      // If new figure cannot fit in grid ...
      if (!roomInGrid) {
        gameover(app);
      }
      else {
        setFigures([...getFigures(), newFig]);
      }
    }
  }
}
