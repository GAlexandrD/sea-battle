import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { PrismaClient } from '@prisma/client';

@Controller('game')
export class GameController {
  constructor(
    private gameGateway: GameGateway,
    private gameService: GameService,
    private prisma: PrismaClient,
  ) {}

  @Post('connect-to-session')
  async connectToSession(@Body() body: any) {
    try {
      const { playerId, sessionId, field } = body;
      if (!sessionId || !field || !playerId) {
        throw new HttpException('', HttpStatus.BAD_REQUEST);
      }
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
      const sockets = await this.gameGateway.getSockets();
      const player2 = await this.prisma.players.findFirst({
        where: { id: session.player2 },
      });
      const socketP2 = sockets.find((s) => s.id === player2.socketId);
      if (!socketP2) throw new HttpException('', HttpStatus.BAD_REQUEST);
      socketP2.emit('player-connected');
      return response;
    } catch (error) {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }
  }
  @Post('make-session')
  async makeSession(@Body() body: any) {
    try {
      const { playerId, field } = body;
      if (!playerId || !field)
        throw new HttpException('', HttpStatus.BAD_REQUEST);
      const session = await this.gameService.makeSession(playerId, field);
      const response = { sessionId: session.id };
      return response;
    } catch (error) {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('shoot')
  async shoot(@Body() body: any) {
    try {
      const { playerId, x, y } = body;
      if (!playerId || !x || !y)
        throw new HttpException('', HttpStatus.BAD_REQUEST);
      const response = await this.gameService.shoot(playerId, x, y);
      const player2Id = await this.gameService.getAnotherPlayer(playerId);
      const player2 = await this.prisma.players.findFirst({
        where: { id: player2Id },
      });
      const sockets = await this.gameGateway.getSockets();
      const socketP2 = sockets.find((s) => s.id === player2.socketId);
      if (!socketP2) throw new HttpException('', HttpStatus.BAD_REQUEST);
      socketP2.emit('shoot', response);
      return response;
    } catch (error) {
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }
  }
}
