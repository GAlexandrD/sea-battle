import { shootRes } from "src/services/GameRules";
import { IField } from "src/types/IField";
import { IShip } from "src/types/IShip";

export interface IFieldRepository {
  addField(playerId: number, field: IField): Promise<void>;
  addShip(ship: IShip, fieldId: number): Promise<void>;
  getField(playerId: number): Promise<IField>;
  updateField(
    x: number,
    y: number,
    playerId: number,
    resp: shootRes
  ): Promise<void>;
  removeField(playerId: number): Promise<void>;
}