import { shootRes } from "src/services/GameRules";
import { IField } from "../../IField";

export interface IGame {
  shoot(x: number, y: number, field: IField): shootRes 
}