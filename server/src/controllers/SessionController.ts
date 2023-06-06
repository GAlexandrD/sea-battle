import { Request, Response } from 'express';
import { clients } from '../ws-server';
import { sessionService } from './../singleton';

class SessionController {
  async connectToSession(req: Request, res: Response) {
    try {
      const { playerId, sessionId, field } = req.body;
      if (!sessionId || !field || !playerId) {
        res.sendStatus(400);
      }
      const session = await sessionService.connectToSession(
        playerId,
        sessionId,
        field
      );
      const response = {
        sessionId: session.id,
        player1: session.player1,
        player2: session.player2,
      };
      const ws = clients.find((c) => c.userId === response.player2);
      if (!ws) return res.sendStatus(403).send('error');
      const message = JSON.stringify({ event: 'player-connected' });
      ws.ws.send(message);
      return res.send(response);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  async makeSession(req: Request, res: Response) {
    try {
      const { playerId, field } = req.body;
      if (!playerId || !field) throw new Error();
      const session = await sessionService.makeSession(playerId, field);
      const response = { sessionId: session.id };
      return res.send(response);
    } catch (error) {
      res.sendStatus(400);
    }
  }
}

export const sessionController = new SessionController();
