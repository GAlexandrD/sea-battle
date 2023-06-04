import { sequelize } from '../db.js';
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  ForeignKey,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import DeckModel from './Deck.js';

class ShipModel extends Model<
  InferAttributes<ShipModel>,
  InferCreationAttributes<ShipModel>
> {
  declare id: CreationOptional<number>;
  declare x: number;
  declare y: number;
  declare isDestroyed: boolean;
  declare fieldId: ForeignKey<number>;
  declare decks: NonAttribute<DeckModel[]>;
}

ShipModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    x: { type: DataTypes.INTEGER },
    y: { type: DataTypes.INTEGER },
    isDestroyed: { type: DataTypes.BOOLEAN },
  },
  { tableName: 'ships', sequelize }
);

export default ShipModel;
