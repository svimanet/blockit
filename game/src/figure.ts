import { Application, Container, FederatedPointerEvent, Graphics } from 'pixi.js';
import type { DisplayObject } from 'pixi.js';
import type { FigureNode, Shape } from './types';
import { grid32, randomColour, shapes } from './utils';

export class Figure implements Figure {
  color: number;
  points: number;
  container: Container;
  shape: Shape;
  xMoveDiff: number = 0;
  yMoveDiff: number = 0;

  constructor(
    shape: Shape,
    setDragTarget: (target: Figure) => void,
    app: Application,
    cellSize: number,
  ){
    this.container = new Container();
    this.color = 0;
    this.points = 0;
    this.shape = shape;
    this.makeNodes(
      shapes[shape],
      this.container,
      cellSize
    );

    // Pointer down event, set as global active drag target
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
    this.container.on('pointerdown', (e: FederatedPointerEvent) => {
      this.xMoveDiff = this.container.x - e.clientX;
      this.yMoveDiff = this.container.y - e.clientY;
      setDragTarget(this);
    });

    app.stage.addChild(this.container);
  }

  setPos(x: number, y: number){
    this.container.x = x;
    this.container.y = y;
  }

  /* Create and render each node making up the figure. Nodes are rectangles. Why did i name them nodes. */
  makeNodes = (
    initialNodeCoors: FigureNode[],
    container: Container,
    cellSize: number,
  ): void => {
    const color = randomColour();
    initialNodeCoors.forEach((node) => {
      const square = new Graphics();
      square.beginFill(color);
      square.drawRect(node.x+3, node.y+3, cellSize-6, cellSize-6);
      square.endFill();
      container.addChild(square);
    });
  };

  /**
   * Move the figure to the mouse position.
   * @param e - Mouse Event to follow
   */
  move(e: FederatedPointerEvent) {
    const { container } = this;
    container.alpha = 0.5;

    // Adjust figure position, and take clickd offset into account.
    const x = e.clientX + this.xMoveDiff;
    const y = e.clientY + this.yMoveDiff;
    this.setPos(x, y);
  }

  /**
   * Snap the figure to the grid.
   * 
   * Check for collision with other figures.
   * - If collision, snap back to last position before mouse move.

   * Check if the figure is outside the grid.
   * - If outside, snap to the grid in closes available pos.
   * 
   * Make the action permanent (no moving it after placing on grid).
   * 
   * Check if any grid axis is filled ...
   * @returns true if the figure was placed on the grid, false if not.
  */
  stopMoving(figures: Figure[]): boolean { 
    // Reset pos and return, if outside grid
    if (this.isOutsideGrid()) {
      this.resetPost();
      return false;
    }

    // Check for collision with other figures, after adjusting for grid snap
    const collision = this.collision(figures);
    if (collision) {
      this.resetPost();
      return false;
    }

    // Snap figure in place inside grid
    const gridSnap = this.snapFigureToGrid();
    this.container.x = gridSnap.x;
    this.container.y = gridSnap.y; 

    // Plced on grid, was moved.
    this.container.alpha = 1;
    this.container.eventMode = 'none';
    return true;
  }

  resetPost = () => {
    this.container.alpha = 1;
    this.container.x = 0;
    this.container.y = -192;
    this.setPos(32*3, 32*10+10);// TODO: Copied from main newFigure method. Should couple,
  }

  collision(figures: Figure[]): boolean {
    // For each other figure, check for collision
    return figures.some((figure) => {
      if (figure === this) return false; // Skip potential self collision

      // For each rect in This figure
      return this.container.children.some((node: DisplayObject) => {

        // For each rect in other fiure
        return figure.container.children.some((otherNode: DisplayObject) => {

          // If a node in this figure collides with a node in the other figure, return true (Collides)
          if (node.getBounds().intersects(otherNode.getBounds())) {
            return true;
          }
        });
      });
    });
  }

  isOutsideGrid = (): boolean => {
    const aboveGrid = this.container.y < grid32[0]-15;
    const belowGrid = this.container.y > grid32[grid32.length-1]+15;
    const leftOfGrid = this.container.x < grid32[0]-15;
    const rightOfGrid = this.container.x > grid32[grid32.length-1]+15;

    if (aboveGrid || belowGrid || leftOfGrid || rightOfGrid) {
      return true;
    }
    return false;
  }

  /*
    Return coordinates for closest 'perfect symetrical' position in grid.
  */
  snapFigureToGrid = (): { x: number, y: number } => {
    let closestX = this.container.x;
    let closestY = this.container.y;

    /* Select closest grid corner for this x and y */
    /* Reduce through options, and return closest. */

    if (!grid32.includes(this.container.x)) {
      closestX = grid32.reduce((prev, curr) => {
        const currDiff = Math.abs(curr - this.container.x);
        const prevDiff = Math.abs(prev - this.container.x);
        return (currDiff < prevDiff ? curr : prev);
      });
    }
    if (!grid32.includes(this.container.y)) {
      closestY = grid32.reduce((prev, curr) => {
        const currDiff = Math.abs(curr - this.container.y);
        const prevDiff = Math.abs(prev - this.container.y);
        return (currDiff < prevDiff ? curr : prev);
      });
    }

    return { x: closestX, y: closestY};
  }

  /* Return node coord adjusted for padding */
  nodeValuesAdjusted = (
    node: Graphics, xpadding: number, ypadding: number): { x: number, y: number } => {
    const bounds = node.getBounds();
    return {
      x: bounds.x - xpadding,
      y: bounds.y - ypadding,
    };
  }
}