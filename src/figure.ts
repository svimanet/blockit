import { Application, Container, DisplayObject, FederatedPointerEvent, Graphics } from 'pixi.js';
import type { FigureNode, Shape } from './types';
// import { shapes } from './utils';

export class Figure implements Figure {
  color: number;
  points: number;
  // nodes: Graphics[];
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
    // TODO: Fix shapes. Was dependent on static grid/cell size.
    // idk some math shit i cant think of rn
    // this.nodes = 
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

    // Pointer down event, for setting this obj as global active drag target
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

    // const nodes: Graphics[] = [];
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
      // nodes.push(square);
    });

    // return(nodes);
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
  stopMoving(figures: Figure[], cellsize: number, sidepadding: number, figureStartPos: {x:number,y:number}): boolean { 
    // Snap to closest grid cells possible before checking anything
    const gridSnap = this.snapFigureToGrid(cellsize, sidepadding);
    this.container.x = gridSnap.x;
    this.container.y = gridSnap.y;
    this.container.alpha = 1;

    // TODO: maybe this should be global
    const positions: number[] = [];
    for (let x=0; x<=10; x++) {
      positions.push((cellsize*x));
    }

    const size = this.container.getBounds();
    const oob = size.left < positions[0]+sidepadding
      || size.top < positions[0]+sidepadding
      || size.right > positions[positions.length-1]+sidepadding
      || size.bottom > positions[positions.length-1]+sidepadding;

    if (oob) {
      this.container.x = figureStartPos.x;
      this.container.y = figureStartPos.y;
      return false;
    }

    // Check for collision with other figures, after adjusting for grid snap
    const collision = this.collision(figures);
    if (collision) {
      this.container.x = figureStartPos.x;
      this.container.y = figureStartPos.y;
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
  snapFigureToGrid = (cellsize:number, sidepadding:number): { x: number, y: number } => {
    let x = this.container.x;
    let y = this.container.y;

    const gridsize = cellsize*10;

    // In theory the cells anly consist of 10*10 number combos,
    // but there is also only 10 numbers to coose from
    // x (width pos) wil always be 0, 64, 128, ..., 
    // if the cells are 64 big.
    // the same goes for y, since they are square.
    // so we find the starting pos (after padding), 
    // and the next cell pos by cellsize
    const positions: number[] = [];
    for (let x=0; x<=10; x++) {
      positions.push((cellsize*x));
    }

    /* Select closest grid corner for this x and y */
    /* Reduce through options, and return closest. */

    if (!positions.includes(this.container.x)) {
      x = positions.reduce((prev, curr) => {
        const currDiff = Math.abs(curr - this.container.x);
        const prevDiff = Math.abs(prev - this.container.x);
        return (currDiff < prevDiff ? curr : prev);
      });
    }
    if (!positions.includes(this.container.y)) {
      y = positions.reduce((prev, curr) => {
        const currDiff = Math.abs(curr - this.container.y);
        const prevDiff = Math.abs(prev - this.container.y);
        return (currDiff < prevDiff ? curr : prev);
      });
    }

    /* Check if figure is out of bounds (partially out of the grid) and adjust */

    const numHorizontalCells = Math.round(this.container.width / 64);
    const numVerticalCells = Math.round(this.container.height / 64);

    const maxX = this.container.x + this.container.width/2 ;
    if (maxX > positions[positions.length - 1]) {
      x = positions[positions.length - (numHorizontalCells)];
    }
    const maxY = this.container.y + this.container.height/2;
    if (maxY > positions[positions.length - 1]) {
      y = positions[positions.length - (numVerticalCells)];
    }

    return { x: x, y: y};
  }
}