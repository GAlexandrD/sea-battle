import { IShip } from './IShip';
import { ICell } from './ICell';

export interface IField {
  width: number;
  height: number;
  cells: ICell[][];
  ships: IShip[];
}
