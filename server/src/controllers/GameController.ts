import { Request, Response } from 'express';
import { gameService } from '../services/GameService';
import { clients } from '../ws-server';
import { sessionService } from '../services/SessionService';

class GameController {
  async shoot(req: Request, res: Response) {
    try {
      const { playerId, x, y } = req.body;
      if (!playerId || !x || !y) throw new Error(); 
      const response = await gameService.shoot(playerId, x, y);
      const player2 = await sessionService.getAnotherPlayer(playerId);
      const client = clients.find((c) => c.userId === player2);
      if (!client) throw new Error('no such player');
      const message = JSON.stringify({
        ...response,
        event: 'shoot',
      });
      client.ws.send(message);
      return res.send(response);
    } catch (error) {
      res.sendStatus(400)
    }
  }
}

export const gameController = new GameController();
