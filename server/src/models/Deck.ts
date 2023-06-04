import { sequelize } from '../db.js';
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';

class DeckModel extends Model<
  InferAttributes<DeckModel>,
  InferCreationAttributes<DeckModel>
> {
  declare id: CreationOptional<number>;
  declare x: number;
  declare y: number;
  declare isDamaged: boolean;
  declare shipId: ForeignKey<number>;
}

DeckModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    x: { type: DataTypes.INTEGER },
    y: { type: DataTypes.INTEGER },
    isDamaged: { type: DataTypes.BOOLEAN },
  },
  { tableName: 'decks', sequelize }
);

export default DeckModel;
