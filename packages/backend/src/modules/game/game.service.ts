import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IField } from 'src/types/IField';
import { ISession } from 'src/types/ISession';
import { FieldService } from '../field/field.service';
import { GameRules } from '../game-rules/game-rules';
import { IShoot } from 'src/types/IShoot';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaClient,
    private fieldService: FieldService,
  ) {}
  async makeSession(playerId: number, field: IField): Promise<ISession> {
    await this.fieldService.createField(playerId, field);

    const foundSession = await this.prisma.sessions.findFirst({
      where: {
        OR: [{ player1: playerId }, { player2: playerId }],
      },
    });
    if (foundSession) {
      await this.prisma.sessions.delete({ where: { id: foundSession.id } });
    }

    const session = await this.prisma.sessions.create({
      data: {
        id: Math.random().toString(16).slice(2),
        movingSide: false,
        player1: playerId,
      },
    });
    return session;
  }
  async connectToSession(
    playerId: number,
    sessionId: string,
    field: IField,
  ): Promise<ISession> {
    const foundSession = await this.prisma.sessions.findFirst({
      where: { id: sessionId },
    });
    if (!foundSession)
      throw new HttpException(
        'Session with such id doesn`t exists',
        HttpStatus.BAD_REQUEST,
      );
    const updatedSession = await this.prisma.sessions.update({
      where: { id: foundSession.id },
      data: { player2: playerId },
    });
    await this.fieldService.createField(playerId, field);
    return {
      player1: updatedSession.player1,
      player2: updatedSession.player1,
      id: updatedSession.id,
    };
  }
  async deleteSession(playerId: number): Promise<ISession> {
    const foundSession = await this.findSession(playerId);
    if (!foundSession)
      throw new HttpException('No such session', HttpStatus.BAD_REQUEST);
    return await this.prisma.sessions.delete({
      where: { id: foundSession.id },
    });
  }

  async findSession(playerId: number): Promise<ISession> {
    return await this.prisma.sessions.findFirst({
      where: { OR: [{ player1: playerId }, { player2: playerId }] },
    });
  }

  async getAnotherPlayer(playerId: number): Promise<number> {
    const session = await this.findSession(playerId);
    if (!session) throw new Error('Session wasn`t found');
    let player2 = session.player1;
    if (player2 === playerId) player2 = session.player2;
    return player2;
  }

  async shoot(playerId: number, x: number, y: number): Promise<IShoot> {
    const session = await this.findSession(playerId);
    if (!session) throw new Error('Session didn`t found');
    if (!session.player1 || !session.player2) {
      throw new Error('not enough players');
    }
    let player2 = session.player2;
    if (playerId === player2) player2 = session.player1;
    const field = await this.fieldService.getField(player2);
    const resp = GameRules.shoot(x, y, field);
    if (resp.isShip) {
      this.fieldService.updateField(x, y, player2, resp);
    }
    if (resp.isOver) this.endGame(session);
    return resp;
  }

  async endGame(session: ISession): Promise<void> {
    await this.fieldService.removeField(session.player1);
    await this.fieldService.removeField(session.player2);
    await this.deleteSession(session.player1);
  }
}
