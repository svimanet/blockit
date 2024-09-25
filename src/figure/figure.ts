import { Application, Container, DisplayObject, FederatedPointerEvent, Graphics } from 'pixi.js';
import type { FigureNode, Shape } from '../types';

export class Figure implements Figure {
  color: number;
  points: number;
  container: Container;
  shape: Shape;
  clickPosition: { x: number, y: number };

  /**
   * - Requires decoupled callback for keeping mouse-drag state outside object scope.
   * - Requires app obj for attaching internaly created render-objects onto the app.
   * @param shape - Which shape to create
   * @param cellSize - Size in px, of each cell/node in fig.
   * @param setDragTarget
   * @param app 
   */
  constructor(
    shape: Shape,
    setDragTarget: (target: Figure) => void,
    app: Application,
    cellSize: number,
    sidepadding: number,
    shapes: Record<Shape, FigureNode[]>,
  ){
    this.container = new Container();
    this.color = 0;
    this.points = 0;
    this.shape = shape;
    this.makeNodes(
      shapes[shape],
      this.container,
      cellSize,
      sidepadding
    );
    this.clickPosition = {
      x: this.container.x,
      y: this.container.y
    };

    // TODO: Why is this done here, should probably be done outside
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
    this.container.on('pointerdown', 
    (e: FederatedPointerEvent) => {
      this.clickPosition = { x: e.clientX, y: e.clientY };
      setDragTarget(this);
    });
    app.stage.addChild(this.container);
  }

  setPos(x: number, y: number){
    this.container.x = x;
    this.container.y = y;
  }

  /* Create and render each node making up the figure.
  Nodes are rectangles. Why did i name them nodes. */
  makeNodes = (
    initialNodeCoors: FigureNode[],
    container: Container,
    cellSize: number,
    sidepadding: number,
  ): void => {
    const randomColor = Math.floor(Math.random()*16777215);

    initialNodeCoors.forEach((node) => {
      const square = new Graphics();
      square.beginFill(randomColor);
      square.drawRect(
        node.x + sidepadding+3,
        node.y + sidepadding+3,
        cellSize-6,
        cellSize-6
      );
      square.endFill();
      container.addChild(square);
    });
  };

  /**
   * Move the figure relative to the mouse position.
   * Make the figure a bit transparent while doing so.
   * @param e - Mouse Event to follow
   */
  move(e: FederatedPointerEvent) {
    const { container, clickPosition } = this;
    container.alpha = 0.5;

    const prevClickPos = clickPosition;
    const currClickPos = { x: e.clientX, y: e.clientY };
    this.clickPosition = currClickPos; 

    const xDiff = prevClickPos.x - currClickPos.x;
    const yDiff = prevClickPos.y - currClickPos.y;

    const x = container.x - xDiff;
    const y = container.y - yDiff;
    this.container.x = x;
    this.container.y = y;
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
  stopMoving(
    figures: Figure[],
    cellsize: number,
    toppadding: number,
    figureStartPos: {x:number,y:number},
    edgepadding: number
  ): boolean { 
    this.container.alpha = 1;
    // Snap to closest grid cells possible before checking anything
    const gridSnap = this.snapFigureToGrid(cellsize, toppadding, edgepadding);

    // TODO: maybe this should be global
    const positions: number[] = [];
    for (let x=0; x<=11; x++) {
      positions.push(((cellsize*x)));
    }

    // Check for Out Of Bounds placement.
    // Reset position and return if OOB.
    const bounds = this.container.getBounds();
    const oob = bounds.left < positions[0]+edgepadding
      || bounds.top < positions[0]+toppadding
      || bounds.right > positions[positions.length-1]+edgepadding
      || bounds.bottom > positions[positions.length-1]+toppadding;
    if (oob) {
      this.container.x = figureStartPos.x;
      this.container.y = figureStartPos.y;
      return false;
    }

    // Check for collision with other figures, after adjusting for grid snap
    // Reset position and return if collision
    const collision = this.collision(figures);
    if (collision) {
      this.container.x = figureStartPos.x;
      this.container.y = figureStartPos.y;
      return false;
    }

    // TODO: Figure out where this offset comes from..
    // offset by just a little less than half a cell, idk why, it bothers me
    this.container.x = gridSnap.closestX.x - (cellsize/1.8);
    this.container.y = gridSnap.closestY.y - (cellsize/1.8);

    this.container.eventMode = 'none';
    return true;
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
            console.log('COLLISION');
            return true;
          }
          return false;
        });
      });
    });
  }

  /*
    Return coordinates for closest 'perfect symetrical' position in grid.
    If the figure is outside the grid, snap it back to the grid as closest possible pos.
  */
  snapFigureToGrid = (cellsize:number, toppadding:number, edgepadding: number) => {
    let x = this.container.x;
    let y = this.container.y;
    const gridsize = cellsize*10;

    const positions: number[] = [];
    for (let i=0; i<=12; i++) {
      positions.push(((cellsize*i)));
    }

    let closestX: {x:number,diff:number} = {x:0, diff:cellsize*10};
    let closestY: {y:number,diff:number} = {y:0, diff:cellsize*10};

    positions.forEach((pos) => {

      console.group('snapFigureToGrid');
      console.log(`x: ${pos}  x+edgepadding: ${pos+edgepadding}`);
      console.log(`y: ${pos}  y+toppadding: ${pos+toppadding}`);
      console.groupEnd();

      const posDiffX = Math.round(Math.abs((pos+edgepadding) - this.container.x));
      const posDiffY = Math.round(Math.abs((pos+toppadding) - this.container.y));
      if (posDiffX < closestX.diff) {
        closestX = { x: (pos+edgepadding), diff: posDiffX };
      }
      if (posDiffY < closestY.diff) {
        closestY = { y: (pos+toppadding), diff: posDiffY };
      }
    });

    return ({ closestX, closestY });
  }
}