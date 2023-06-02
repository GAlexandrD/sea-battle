export type variant =
  | 'destroyed'
  | 'unrevealed'
  | 'checked'
  | 'damaged'
  | 'ship'
  | 'choosen';

export interface ICell {
  x: number;
  y: number;
  variant: variant;
}
