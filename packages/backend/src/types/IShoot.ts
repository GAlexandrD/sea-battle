import { IShip } from './IShip';

export interface IShoot {
  x: number;
  y: number;
  isShip: boolean;
  isDestroyed: IShip | null;
  isOver: boolean;
}
