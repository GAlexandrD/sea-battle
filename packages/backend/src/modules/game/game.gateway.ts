import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PrismaClient } from '@prisma/client';
import { RemoteSocket, Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

@Injectable()
@WebSocketGateway({
  transports: ['websocket'],
})
export class GameGateway implements OnModuleInit {
  constructor(
    private prisma: PrismaClient,
    private gameService: GameService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      const player = await this.prisma.players.create({
        data: {
          socketId: socket.id,
        },
      });
      socket.emit('connect-player', player.id);
      socket.conn.on('close', async () => {
        const session = await this.gameService.findSession(player.id);
        if (session) {
          const player2Id = await this.gameService.getAnotherPlayer(player.id);
          const player2 = await this.prisma.players.findFirst({
            where: { id: player2Id },
          });
          const sockets = await this.getSockets();
          const socketPlayer2 = sockets.find((c) => c.id === player2.socketId);
          if (socketPlayer2) {
            socketPlayer2.emit('session-closed');
          }
          await this.gameService.deleteSession(player.id);
        }
        await this.prisma.players.delete({ where: { id: player.id } });
      });
    });
  }

  async getSockets(): Promise<RemoteSocket<DefaultEventsMap, any>[]> {
    return await this.server.fetchSockets();
  }

  @SubscribeMessage('shoot')
  async handleMessage(client: Socket, payload: any): Promise<void> {
    const { playerId, x, y } = payload;
    if (!playerId || !x || !y)
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    const response = await this.gameService.shoot(playerId, x, y);
    const player2Id = await this.gameService.getAnotherPlayer(playerId);
    const player2 = await this.prisma.players.findFirst({
      where: { id: player2Id },
    });
    const sockets = await this.getSockets();
    const socket = sockets.find((s) => s.id === player2.socketId);
    if (!socket)
      throw new HttpException('no such player', HttpStatus.BAD_REQUEST);
    socket.emit('shoot', response);
  }

  @SubscribeMessage('connect-to-session')
  async connectToSession(client: Socket, payload: any) {
    const { playerId, sessionId, field } = payload;
    const session = await this.gameService.connectToSession(
      playerId,
      sessionId,
      field,
    );
    const response = {
      sessionId: session.id,
      player1: session.player1,
      player2: session.player2,
    };
    const sockets = await this.getSockets();
    const player2 = await this.prisma.players.findFirst({
      where: { id: session.player2 },
    });
    const socketP2 = sockets.find((s) => s.id === player2.socketId);
    socketP2.emit('player-connected');
    client.emit('connected-to-session', response);
  }

  @SubscribeMessage('make-session')
  async makeSession(client: Socket, payload: any) {
    const { playerId, field } = payload;
    const session = await this.gameService.makeSession(playerId, field);
    const response = { sessionId: session.id };
    return client.emit('session-created', response);
  }
}
