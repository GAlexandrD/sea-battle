import WebSocket, { WebSocketServer } from 'ws';
import PlayerModel from './models/Player.js';
import { sessionService } from './services/SessionService.js';
import dotenv from 'dotenv';
dotenv.config()

interface Client {
  userId: number;
  ws: WebSocket.WebSocket;
}

export const clients: Client[] = [];

const WS_PORT = process.env.PORT_WS || 4001;
const wss = new WebSocketServer({
  port: +WS_PORT,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024,
  },
});

export const startWSS = () => {
  wss.on('connection', async (ws) => {
    try {
      const player = await PlayerModel.create();
      ws.send(JSON.stringify({ event: 'connect', userId: player.id }));
      clients.push({ userId: player.id as number, ws });
      ws.on('close', async () => {
        const session = await sessionService.findSession(player.id);
        if (session) {
          let player2 = session.player2;
          if (player2 === player.id) player2 = session.player1;
          const wsPlayer2 = clients.find((c) => c.userId === player2);
          if (wsPlayer2) {
            wsPlayer2.ws.send(JSON.stringify({ event: 'session-closed' }));
          }
          session.destroy();
        }
        player.destroy();
      });
    } catch (error) {
      console.log(error);
    }
  });
}
