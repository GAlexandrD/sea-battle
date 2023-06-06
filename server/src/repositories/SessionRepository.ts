import { Op } from 'sequelize';
import SessionModel from  '../models/Session';
import { ISession } from '../types/ISession';
import { ISessionRepository } from '../types/interfaces/repositories/ISessionRepository';

export class SessionRepository implements ISessionRepository {
  async createSession(playerId: number): Promise<ISession> {
    const prevSession = await SessionModel.findOne({
      where: { [Op.or]: [{ player1: playerId }, { player2: playerId }] },
    });
    if (prevSession) await prevSession.destroy();
    const newSession = await SessionModel.create({
      id: Math.random().toString(16).slice(2),
      player1: playerId,
      movingSide: true,
    });
    return {
      id: newSession.id,
      player1: newSession.player1,
      player2: newSession.player2,
    };
  }
  async connectToSession(
    playerId: number,
    sessionId: string
  ): Promise<ISession> {
    const condidate = await SessionModel.findOne({ where: { id: sessionId } });
    if (!condidate) throw new Error('Session with such id doesn`t exists');
    await condidate.update({ player2: playerId });
    await condidate.reload();
    return {
      id: condidate.id,
      player1: condidate.player1,
      player2: condidate.player2,
    };
  }

  async getSession(playerId: number): Promise<ISession | null> {
    const session = await SessionModel.findOne({
      where: { [Op.or]: [{ player1: playerId }, { player2: playerId }] },
    });
    if (!session) return null;
    return {
      id: session.id,
      player1: session.player1,
      player2: session.player2,
    };
  }
  async deleteSession(playerId: number): Promise<ISession | null> {
    const session = await SessionModel.findOne({
      where: { [Op.or]: [{ player1: playerId }, { player2: playerId }] },
    });
    if (!session) return null;
    await session.destroy();
    return {
      id: session.id,
      player1: session.player1,
      player2: session.player2,
    };
  }
}
