
import type { Application } from "pixi.js";
import { Figure } from "../figure";
import type { FigureNode, Shape } from "../types";
import { randomShape } from "./shapes";

interface nRFProps {
  shapes: Record<Shape, FigureNode[]>;
  setDragTarget: (target: Figure) => Figure;
  app: Application;
  cellsize: number;
  padding: number;
  figures: Figure[];
  pos: {
    x: number;
    y: number;
  };
}

/**
 * Generate new figure to start with
 */
export const newRandomFigure = (props: nRFProps) => {
  const {
    pos,
    shapes,
    setDragTarget,
    app,
    cellsize,
    padding,
    figures
  } = props;
  const { x, y } = pos;
  const shape = randomShape(shapes);
  const setter = setDragTarget;
  const figure = new Figure(shape, setter, app, cellsize, padding, shapes);
  figure.setPos(x,y);
  figures.push(figure);
}

