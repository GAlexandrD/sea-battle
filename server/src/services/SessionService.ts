import { Op } from 'sequelize';
import SessionModel from '../models/Session';
import { IField } from '../types/IField';
import { ISession } from 'src/types/ISession';
import { IFieldService } from 'src/types/interfaces/IFieldService';

export class SessionService {
  constructor(
    private field: IFieldService
  ) {}
  async makeSession(playerId: number, field: IField): Promise<ISession> {
    await this.field.addField(playerId, field);
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
    sessionId: number,
    field: IField
  ): Promise<ISession> {
    const session = await SessionModel.findOne({ where: { id: sessionId } });
    if (!session) throw new Error('session didn`t found');
    await session.update({ player2: playerId });
    await this.field.addField(playerId, field);
    return {
      player1: session.player1,
      player2: session.player1,
      id: session.id,
    };
  }

  async deleteSession(playerId: number): Promise<ISession> {
    const session = await SessionModel.findOne({
      where: {
        [Op.or]: [{ player1: playerId }, { player2: playerId }],
      },
    });
    if (session) {
      session.destroy();
      return {
        id: session.id,
        player1: session.player1,
        player2: session.player2,
      };
    }
  }

  async findSession(playerId: number): Promise<ISession> {
    const session = await SessionModel.findOne({
      where: {
        [Op.or]: [{ player1: playerId }, { player2: playerId }],
      },
    });
    return {
      id: session.id,
      player1: session.player1,
      player2: session.player2,
    };
  }

  async validateSession(playerId: number): Promise<ISession> {
    const session = await SessionModel.findOne({
      where: {
        [Op.or]: [{ player1: playerId }, { player2: playerId }],
      },
    });
    if (!session) throw new Error('no such session');
    if (!session.player1 || !session.player2)
      throw new Error('not enough players');
    return {
      id: session.id,
      player1: session.player1,
      player2: session.player2,
    };
  }

  async getAnotherPlayer(playerId: number): Promise<number> {
    const session = await this.validateSession(playerId);
    let player2 = session.player1;
    if (player2 === playerId) player2 = session.player2;
    return player2;
  }
}
