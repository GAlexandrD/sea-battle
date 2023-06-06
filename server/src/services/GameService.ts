import { shootRes } from './GameRules';
import { IGameService } from '../types/interfaces/services/IGameService';
import { IGame } from '../types/interfaces/services/IGame';
import { ISession } from '../types/ISession';
import { IFieldRepository } from '../types/interfaces/repositories/IFieldRepository';
import { ISessionRepository } from '../types/interfaces/repositories/ISessionRepository';

export class GameService implements IGameService {
  constructor(
    private field: IFieldRepository,
    private game: IGame,
    private session: ISessionRepository
  ) {}

  async shoot(playerId: number, x: number, y: number): Promise<shootRes> {
    const session = await this.session.getSession(playerId);
    if (!session) throw new Error('Session didn`t found');
    if (!session.player1 || !session.player2) {
      throw new Error('not enough players');
    }
    let player2 = session.player2;
    if (playerId === player2) player2 = session.player1;
    const field = await this.field.getField(player2);
    const resp = this.game.shoot(x, y, field);
    if (resp.isShip) {
      this.field.updateField(x, y, player2, resp);
    }
    if (resp.isOver) this.endGame(session);
    return resp;
  }

  async endGame(session: ISession): Promise<void> {
    await this.field.removeField(session.player1);
    await this.field.removeField(session.player2);
    await this.session.deleteSession(session.player1);
  }
}
