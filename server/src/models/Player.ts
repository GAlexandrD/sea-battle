import { sequelize } from '../db.js';
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
} from 'sequelize';

class PlayerModel extends Model<
  InferAttributes<PlayerModel>,
  InferCreationAttributes<PlayerModel>
> {
  declare id: number;
}

PlayerModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  { tableName: 'players', sequelize }
);

export default PlayerModel;
