import { shootRes } from "src/logic/Game";
import { IField } from "../IField";

export interface IGame {
  shoot(x: number, y: number, field: IField): shootRes 
}