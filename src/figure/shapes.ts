import type { Figure, FigureNode, Shape } from "../types";

export const makeShapes = (cellsize: number): Record<Shape, FigureNode[]> => {
  const c1 = cellsize;
  const c2 = c1*2;
  const c3 = c1*3;

  const O: FigureNode[] = [
    { x: 0, y: 0 },
    { x: c1, y: c1},
    { x: 0, y: c1 },
    { x: c1, y: 0 },
  ];
  const I1: FigureNode[] = [
    { x:0, y:0 },
    { x:0, y:c1},
    { x:0, y:c2},
    { x:0, y:c3}
  ];
  const I2 = [
    {x:0, y:0},
    {x:c1, y:0},
    {x:c2, y:0},
    {x:c3, y:0},
  ];
  const Z1 = [
    {x:0, y:0},
    {x:c1, y:0},
    {x:c1, y:c1},
    {x:c2, y:c1},
  ];
  const Z2 = [
    {x:0, y:c1},
    {x:c1, y:0},
    {x:c1, y:c1},
    {x:c2, y:0},
  ];
  const Z3 = [
    {x:0, y:0},
    {x:0, y:c1},
    {x:c1, y:c1},
    {x:c1, y:c2},
  ];
  const Z4 = [
    {x:0, y:c1},
    {x:c1, y:0},
    {x:c1, y:c1},
    {x:0, y:c2},
  ];
  const L1 = [
    {x:0, y:0},
    {x:0, y:c1},
    {x:0, y:c2},
    {x:c1, y:c2},
  ];
  const L2 = [
    {x:0, y:0},
    {x:0, y:c1},
    {x:0, y:c2},
    {x:c1, y:0},
  ];
  const L3 = [
    {x:0, y:0},
    {x:c1, y:0},
    {x:c2, y:0},
    {x:c2, y:c1},
  ];
  const L4 = [
    {x:0, y:c1},
    {x:c1, y:c1},
    {x:c2, y:c1},
    {x:c2, y:0},
  ];
  const T1 = [
    {x:0, y:0},
    {x:c1, y:0},
    {x:c2, y:0},
    {x:c1, y:c1},
  ];
  const T2 = [
    {x:0, y:0},
    {x:0, y:c1},
    {x:0, y:c2},
    {x:c1, y:c1},
  ];
  const T3 = [
    {x:c1, y:0},
    {x:0, y:c1},
    {x:c1, y:c1},
    {x:c2, y:c1},
  ];
  const T4 = [
    {x:c1, y:0},
    {x:0, y:c1},
    {x:c1, y:c1},
    {x:c2, y:c1},
  ];

  return {
    O, I1, I2,
    T1, T2, T3, T4,
    L1, L2, L3, L4,
    Z1, Z2, Z3, Z4
  } as Record<Shape, FigureNode[]>;
};

export const randomShape = (figures: Record<Shape, FigureNode[]>): Shape => {
  const shapes  = Object.keys(figures) as Shape[];
  const randShape = shapes[Math.floor(Math.random() * shapes.length)];
  return randShape;
}

/**
 * Check if an horizontal I2 can fit in the grid
 * @param grid 
 * @returns 
 */
export const canFitI2 = (grid: number[][]): boolean => {
  for (let x=0; x<10; x++) {
    const row = grid[x];
    let count = 0;
    for (let y=0; y<10; y++) {
      const col = row[y];
      if (count >= 4) {
        console.log(`found free slot after ${x}+${y} iterations`);
        return true;
      }
      if (col === 0) count++;
      else count = 0;
    }
  }
  return false;
};

export const canFitFigureInGrid = (figure: Figure, figures: Figure[]) => {

}