/**
 * Figures are made up of nodes (squares).
 * They are placed on the grid, and give points when removed from the grid.
 * They come in different shapes, which are defined by a set of nodes.
 */
export interface Figure {
  color: number;
  points: number;
  nodes: Graphics[];
  container: Container;
}

export interface FigureNode {
  x: number;
  y: number;
}

export type Shape = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L' | 'I2';
