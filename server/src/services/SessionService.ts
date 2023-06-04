import { Op } from 'sequelize';
import SessionModel from '../models/Session.js';
import { IField } from '../types/IField.js';
import { fieldService } from './FieldService.js';

class SessionService {
  async makeSession(playerId: number, field: IField) {
    await fieldService.addField(playerId, field);
    const newSession = await SessionModel.create({
      id: Math.random().toString(16).slice(2),
      player1: playerId,
      movingSide: true,
    });
    return { sessionId: newSession.id };
  }

  async connectToSession(playerId: number, sessionId: number, field: IField) {
    const session = await SessionModel.findOne({ where: { id: sessionId } });
    if (!session) return { result: 'fail' };
    await session.update({ player2: playerId });
    await fieldService.addField(playerId, field);
    return { player2: session.player1, sessionId: session.id };
  }

  async deleteSession(playerId: number) {
    const session = await SessionModel.findOne({
      where: {
        [Op.or]: [{ player1: playerId }, { player2: playerId }],
      },
    });
    if(session) {
      session.destroy();
      return session;
    }
  }


  async findSession(playerId: number) {
    const session = await SessionModel.findOne({
      where: {
        [Op.or]: [{ player1: playerId }, { player2: playerId }],
      },
    });
    return session;
  }

  async validateSession(playerId: number): Promise<SessionModel> {
    const session = await SessionModel.findOne({
      where: {
        [Op.or]: [{ player1: playerId }, { player2: playerId }],
      },
    });
    if (!session) throw new Error('no such session');
    if (!session.player1 || !session.player2) throw new Error('not enough players');
    return session;
  }

  async getAnotherPlayer(playerId: number) {
    const session = await this.validateSession(playerId);
    let player2 = session.player1;
    if(player2 === playerId) player2 = session.player2;
    return player2;
  }
}

export const sessionService = new SessionService();
