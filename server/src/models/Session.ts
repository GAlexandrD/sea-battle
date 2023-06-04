import { sequelize } from '../db.js';
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  ForeignKey,
  CreationOptional,
} from 'sequelize';

class SessionModel extends Model<
  InferAttributes<SessionModel>,
  InferCreationAttributes<SessionModel>
> {
  declare id: string;
  declare movingSide: boolean;
  declare player1?: ForeignKey<number>;
  declare player2?: ForeignKey<number>;
}

SessionModel.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    movingSide: { type: DataTypes.BOOLEAN }
  },
  { tableName: 'sessions', sequelize }
);

export default SessionModel;
