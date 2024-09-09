import { Application, Container, DisplayObject, FederatedPointerEvent, Graphics } from 'pixi.js';
import type { FigureNode, Shape } from './types';
import { grid64, shapes } from './utils';

export class Figure implements Figure {
  color: number;
  points: number;
  nodes: Graphics[];
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
  ){
    this.container = new Container();
    this.color = 0;
    this.points = 0;
    this.shape = shape;
    this.nodes = this.makeNodes(shapes[shape], this.container, cellSize);
    this.clickPosition = {
      x: this.container.x,
      y: this.container.y
    };

    // Pointer down event, for setting this obj as global active drag target
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

  /* Create and render each node making up the figure. Nodes are rectangles. Why did i name them nodes. */
  makeNodes = (
    initialNodeCoors: FigureNode[],
    container: Container,
    cellSize: number,
  ): Graphics[] => {
    const cells = 10;
    const gridSize = cells * cellSize;
    const screenWidth = window.innerWidth;
    let widthDiff = screenWidth - gridSize;
    let xpadding = widthDiff / 2;
    let ypadding = 200;
    const randomColor = Math.floor(Math.random()*16777215);

    const nodes: Graphics[] = [];
    initialNodeCoors.forEach((node) => {
      const square = new Graphics();
      square.beginFill(randomColor);
      square.drawRect(node.x + xpadding+3, node.y + ypadding+3, cellSize-6, cellSize-6);
      square.endFill();
      container.addChild(square);
      nodes.push(square);
    });

    return(nodes);
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
  stopMoving(figures: Figure[]): boolean { 
    // Calculate closest symetrical grid pos
    const gridSnap = this.snapFigureToGrid();

    // Snap to closest grid cells possible
    this.container.x = gridSnap.x;
    this.container.y = gridSnap.y;
    this.container.alpha = 1;

    // Check for out of bounds (outside grid)
    // const xOOB = 
    //   this.container.x > grid64[0] || 
    //   this.container.x <= grid64[grid64.length-1];
    // const yOOB = 
    // this.container.y > grid64[0] || 
    // this.container.y <= grid64[grid64.length-1];
    // if (xOOB || yOOB) {
    //   this.container.x = 0;
    //   this.container.y = -192;
    //   return false;
    // }

    const figureBot = this.container.y + this.container.height;
    const gridTop = grid64[0];
    const yOOB = figureBot < gridTop;

    if (yOOB) {
      this.container.x = 0;
      this.container.y = -192;
      return false;
    }

    // Check for collision with other figures, after adjusting for grid snap
    const collision = this.collision(figures);
    if (collision) {
      this.container.x = 0;
      this.container.y = -192;
      return false;
    }
    else {
      this.container.eventMode = 'none';
      return true;
    }
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
        });
      });
    });
  }

  /*
    Return coordinates for closest 'perfect symetrical' position in grid.
    If the figure is outside the grid, snap it back to the grid as closest possible pos.
  */
  snapFigureToGrid = (): { x: number, y: number } => {
    let closestX = this.container.x;
    let closestY = this.container.y;

    /* Select closest grid corner for this x and y */
    /* Reduce through options, and return closest. */

    if (!grid64.includes(this.container.x)) {
      closestX = grid64.reduce((prev, curr) => {
        const currDiff = Math.abs(curr - this.container.x);
        const prevDiff = Math.abs(prev - this.container.x);
        return (currDiff < prevDiff ? curr : prev);
      });
    }
    if (!grid64.includes(this.container.y)) {
      closestY = grid64.reduce((prev, curr) => {
        const currDiff = Math.abs(curr - this.container.y);
        const prevDiff = Math.abs(prev - this.container.y);
        return (currDiff < prevDiff ? curr : prev);
      });
    }

    /* Check if figure is out of bounds (partially out of the grid) and adjust */

    const numHorizontalCells = Math.round(this.container.width / 64);
    const numVerticalCells = Math.round(this.container.height / 64);

    const maxX = this.container.x + this.container.width/2 ;
    if (maxX > grid64[grid64.length - 1]) {
      closestX = grid64[grid64.length - (numHorizontalCells)];
    }
    const maxY = this.container.y + this.container.height/2;
    if (maxY > grid64[grid64.length - 1]) {
      closestY = grid64[grid64.length - (numVerticalCells)];
    }

    return { x: closestX, y: closestY};
  }
}