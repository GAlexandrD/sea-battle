import { IFieldRepository } from '../types/interfaces/repositories/IFieldRepository';
import { shootRes } from '../services/GameRules';
import DeckModel from '../models/Deck';
import FieldModel from '../models/Field';
import PlayerModel from '../models/Player';
import ShipModel from '../models/Ship';
import { IField } from '../types/IField';
import { IDeck, IShip } from '../types/IShip';

export class FieldRepository implements IFieldRepository {
  async addField(playerId: number, field: IField) {
    const { width, height, ships } = field;
    const player = await PlayerModel.findOne({ where: { id: playerId } });
    if (!player) throw new Error('no such player');
    const prevField = await FieldModel.findOne({ where: { playerId } });
    if (prevField) await prevField.destroy();
    const newField = await FieldModel.create({ playerId, width, height });
    for (const ship of ships) {
      await this.addShip(ship, newField.id);
    }
  }

  async addShip(ship: IShip, fieldId: number): Promise<void> {
    const { x, y, decks } = ship;
    let isDestroyed = true;
    for (const deck of decks) {
      if (!deck.isDamaged) isDestroyed = false;
    }
    const newShip = await ShipModel.create({
      x,
      y,
      fieldId,
      isDestroyed,
    });
    for (const deck of decks) {
      const { x, y, isDamaged } = deck;
      await DeckModel.create({ x, y, isDamaged, shipId: newShip.id });
    }
  }

  async getField(playerId: number): Promise<IField> {
    const fieldModel = await this.getFieldModel(playerId);
    const ships: IShip[] = fieldModel.ships.map((sh) => {
      const decks: IDeck[] = sh.decks.map((d) => {
        return { isDamaged: d.isDamaged, x: d.x, y: d.y };
      });
      const ship: IShip = { x: sh.x, y: sh.y, decks: decks };
      return ship;
    });
    const field: IField = {
      ships,
      height: fieldModel.height,
      width: fieldModel.width,
    };
    return field;
  }

  private async getFieldModel(playerId: number): Promise<FieldModel> {
    const fieldModel = await FieldModel.findOne({
      where: { playerId: playerId },
      include: [
        {
          model: ShipModel,
          as: 'ships',
          include: [{ model: DeckModel, as: 'decks' }],
        },
      ],
    });
    if (!fieldModel) throw new Error('no field found');
    return fieldModel;
  }

  async updateField(x: number, y: number, playerId: number, resp: shootRes) {
    const fM = await this.getFieldModel(playerId);
    for (const sh of fM.ships) {
      for (const deck of sh.decks) {
        if (deck.x === x && deck.y === y)
          await deck.update({ isDamaged: true });
        if (resp.isDestroyed) await sh.update({ isDestroyed: true });
      }
    }
  }

  async removeField(playerId: number): Promise<void> {
    await FieldModel.destroy({ where: { playerId } });
  }
}
