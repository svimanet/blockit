import type { Application, DisplayObject, FederatedPointerEvent } from "pixi.js";
import type { Figure } from "../figure/figure";
import { checkLineCompletion } from "./lineCompletion";
import { incrementScore } from "./score";
import { canFitNewShape, newRandomFigure,  } from "../figure/utils";
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
export const setPointerReleaseListener = (props: ClickProps) => {
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
      const grid = makeGrid({
        getFigures,
        cellsize,
        padding
      });

      // Check for any complete vertical/horizontal lines ..
      const complete: {
        completed: false | number;
        figures: Figure[]; // new list of figures after potential deletion ... TODO: Refactor SinglePurpose
      } = checkLineCompletion(
        cellsize,
        padding,
        getFigures(),
        grid
      );

      // New Figure generation, ready to place a new one.
      const newFig = newRandomFigure({
        pos: figureStartPos,
        shapes,
        setDragTarget,
        app,
        cellsize,
        padding,
      });

      // If any rows were complete, then we might have deleted som figs // TODO: Refactor to more obvious
      // so set the new figures to be that which we got returned,
      // pluss the new figure.
      if (complete.completed) {
        setFigures([...complete.figures, newFig]);
        console.log('figs len after', getFigures().length);
        incrementScore(complete.completed);
      }
      // Else, just set new figures to include the new one
      else {
        setFigures([...getFigures(), newFig]);
        incrementScore(1);
      }

      // If new figure cannot fit in grid ...
      if (
        !canFitNewShape({
          figure: newFig,
          figures: getFigures(),
          cellsize,
          padding
        })
      ) {
        // Do ...
        gameover(app);
      }
    }
  }
}
