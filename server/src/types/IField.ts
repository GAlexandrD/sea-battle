import { IShip } from "./IShip.js";

export interface IField {
  width: number;
  height: number;
  ships: IShip[];
}