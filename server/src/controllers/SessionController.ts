import { Request, Response } from 'express';
import { sessionService } from '../services/SessionService.js';
import { clients } from '../ws-server.js';

class SessionController {
  async connectToSession(req: Request, res: Response) {
    try {
      const { playerId, sessionId, field } = req.body;
      if (!sessionId || !field || !playerId) {
        res.sendStatus(400)
      } 
      const response = await sessionService.connectToSession(
        playerId,
        sessionId,
        field
      );
      const ws = clients.find((c) => c.userId === response.player2);
      if (!ws) return res.sendStatus(403).send('error');
      const message = JSON.stringify({ event: 'player-connected' });
      ws.ws.send(message);
      return res.send(response);
    } catch (error) {
      res.sendStatus(400)
    }
  }

  async makeSession(req: Request, res: Response) {
    try {
      const { playerId, field } = req.body;
      if (!playerId || !field) throw new Error(); 
      const response = await sessionService.makeSession(playerId, field);
      return res.send(response);
    } catch (error) {
      res.sendStatus(400)
    }
  }
}

export const sessionController = new SessionController();
