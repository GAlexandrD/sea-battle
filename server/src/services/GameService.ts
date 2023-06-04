import FieldModel from '../models/Field.js';
import { sessionService } from './SessionService.js';
import { fieldService } from './FieldService.js';
import { game, shootRes } from '../logic/Game.js';
import SessionModel from '../models/Session.js';

class GameService {
  async shoot(playerId: number, x: number, y: number): Promise<shootRes> {
    const session = await sessionService.validateSession(playerId);
    if (!session.player1 || !session.player2) {
      throw new Error('not enough players');
    }
    let player2 = session.player2;
    if (playerId === player2) player2 = session.player1;
    const field = await fieldService.getField(player2);
    const resp: shootRes = game.shoot(x, y, field);
    if (resp.isShip) {
      fieldService.updateField(x, y, player2, resp);
    }
    if (resp.isOver) this.endGame(session);
    return resp;
  }

  async endGame(session: SessionModel) {
    const field1 = await FieldModel.findOne({
      where: { playerId: session.player1 },
    });
    const field2 = await FieldModel.findOne({
      where: { playerId: session.player2 },
    });
    await field1?.destroy();
    await field2?.destroy();
    await session.destroy();
  }
}

export const gameService = new GameService();
