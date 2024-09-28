import type { Application, FederatedMouseEvent, FederatedPointerEvent, Text } from "pixi.js";
import type { Figure } from "../figure/figure";
import { checkLineCompletion, deleteEmptyFigures } from "./lineCompletion";
import { incrementScore } from "./score";
import { canFitNewShape, newRandomFigure } from "../figure/utils";
import type { FigureNode, Shape } from "../types";
import { gameover } from "./gameover";

export const setMoveListener = (e: FederatedPointerEvent, dragTarget: Figure | undefined) => {
  if (dragTarget) dragTarget.move(e);
};

interface ClickProps {
  app: Application;
  cellsize: number;
  padding: number;
  figureStartPos: {x:number, y:number};
  figures: Figure[];
  setFigures: (figs: Figure[]) => void;
  dragTarget: Figure | undefined;
  setDragTarget: (fig: Figure|undefined) => void;
  shapes: Record<Shape, FigureNode[]>;
}

export const setClickListener = (props: ClickProps) => {
  const {
    app, cellsize, padding,
    figureStartPos, figures,
    dragTarget, setDragTarget,
    setFigures, shapes
  } = props;

  /* Clear dragTarget whenever mousebutton is released in app. */
  // app.stage.on('pointerup', () => {
    if (dragTarget) {
      const placedFigure = dragTarget.stopMoving(figures, cellsize, padding, figureStartPos);
      setDragTarget(undefined);

      if (placedFigure) {
        console.log('figures in play:', figures.length);
        const complete = checkLineCompletion(cellsize, padding, figures);

        if (complete) {
          setFigures(deleteEmptyFigures(figures));
          incrementScore(complete);
        }

        newRandomFigure({
          pos: figureStartPos,
          shapes,
          setDragTarget,
          app,
          cellsize,
          padding,
          figures,
        });

        const canFit = canFitNewShape({
          figure: figures[figures.length-1],
          figures: figures,
          cellsize,
          padding
        });

        if (!canFit) {
          console.log('SKRIKING');
          gameover(app);
        }

        incrementScore(1);
      }
    }
  // });
}
