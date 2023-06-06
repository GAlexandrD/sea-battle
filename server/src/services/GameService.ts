import { shootRes } from '../logic/Game';
import { IGameService } from 'src/types/interfaces/IGameService';
import { IFieldService } from 'src/types/interfaces/IFieldService';
import { IGame } from 'src/types/interfaces/IGame';
import { ISessionService } from 'src/types/interfaces/ISessionService';
import { ISession } from 'src/types/ISession';

export class GameService implements IGameService {
  constructor(
    private field: IFieldService,
    private game: IGame,
    private session: ISessionService
  ){} 

  async shoot(playerId: number, x: number, y: number): Promise<shootRes> {
    const session = await this.session.validateSession(playerId);
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
    await this.field.removeField(session.player1)
    await this.field.removeField(session.player2)
    await this.session.deleteSession(session.player1)
  }
}
