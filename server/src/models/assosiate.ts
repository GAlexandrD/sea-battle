import DeckModel from './Deck';
import FieldModel from './Field';
import PlayerModel from './Player';
import SessionModel from './Session';
import ShipModel from './Ship';

export const assosiate = () => {
  FieldModel.hasMany(ShipModel, {
    as: 'ships',
    foreignKey: 'fieldId',
    onDelete: 'cascade',
  });
  ShipModel.belongsTo(FieldModel);

  ShipModel.hasMany(DeckModel, {
    as: 'decks',
    foreignKey: 'shipId',
    onDelete: 'cascade',
  });
  DeckModel.belongsTo(ShipModel);

  PlayerModel.hasOne(FieldModel, {
    foreignKey: 'playerId',
    onDelete: 'cascade',
  });
  FieldModel.belongsTo(PlayerModel);

  PlayerModel.hasOne(SessionModel, { foreignKey: 'player1' });
  SessionModel.belongsTo(PlayerModel);

  PlayerModel.hasOne(SessionModel, { foreignKey: 'player2' });
  SessionModel.belongsTo(PlayerModel);
};
