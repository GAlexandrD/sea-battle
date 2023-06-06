import { IField } from '../types/IField';
import { ISession } from '../types/ISession';
import { IFieldRepository } from '../types/interfaces/repositories/IFieldRepository';
import { ISessionRepository } from '../types/interfaces/repositories/ISessionRepository';
import { ISessionService } from '../types/interfaces/services/ISessionService';

export class SessionService implements ISessionService {
  constructor(
    private field: IFieldRepository,
    private session: ISessionRepository
  ) {}
  async makeSession(playerId: number, field: IField): Promise<ISession> {
    await this.field.addField(playerId, field);
    const session = await this.session.createSession(playerId);
    return session;
  }

  async connectToSession(
    playerId: number,
    sessionId: string,
    field: IField
  ): Promise<ISession> {
    const session = await this.session.connectToSession(playerId, sessionId);
    await this.field.addField(playerId, field);
    return {
      player1: session.player1,
      player2: session.player1,
      id: session.id,
    };
  }

  async deleteSession(playerId: number): Promise<ISession> {
    return await this.session.deleteSession(playerId);
  }

  async findSession(playerId: number): Promise<ISession> {
    return this.session.getSession(playerId);
  }

  async getAnotherPlayer(playerId: number): Promise<number> {
    const session = await this.session.getSession(playerId);
    if (!session) throw new Error('Session wasn`t found');
    let player2 = session.player1;
    if (player2 === playerId) player2 = session.player2;
    return player2;
  }
}
