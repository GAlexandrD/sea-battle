import { sequelize } from '../db.js';
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from 'sequelize';
import ShipModel from './Ship.js';

class FieldModel extends Model<
  InferAttributes<FieldModel>,
  InferCreationAttributes<FieldModel>
> {
  declare id: CreationOptional<number>;
  declare height: number;
  declare width: number;
  declare playerId: ForeignKey<number>;
  declare ships: NonAttribute<ShipModel[]>;
}

FieldModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    height: { type: DataTypes.INTEGER },
    width: { type: DataTypes.INTEGER },
  },
  { tableName: 'fields', sequelize }
);

export default FieldModel;
