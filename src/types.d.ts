/**
 * Figures are made up of nodes (squares).
 * They are placed on the grid, and give points when removed from the grid.
 * They come in different shapes, which are defined by a set of nodes.
 */
export interface Figure {
  color: number;
  points: number;
  // nodes: Graphics[];
  container: Container;
}

export interface FigureNode {
  x: number;
  y: number;
}

export type Shape = 
  'Z1' | 'Z2' | 'Z3' | 'Z4' |
  'T1' | 'T2' | 'T3' | 'T4' |
  'L1' | 'L2' | 'L3' | 'L4' |
  'I1' | 'I2' | 
  'O';
