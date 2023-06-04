import DeckModel from './Deck.js';
import FieldModel from './Field.js';
import PlayerModel from './Player.js';
import SessionModel from './Session.js';
import ShipModel from './Ship.js';

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
