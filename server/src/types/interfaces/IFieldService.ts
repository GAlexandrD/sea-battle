import { shootRes } from 'src/logic/Game';
import { IField } from '../IField';
import { IShip } from '../IShip';

export interface IFieldService {
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
