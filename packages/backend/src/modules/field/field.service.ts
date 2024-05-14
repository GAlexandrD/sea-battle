import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IField } from 'src/types/IField';
import { IShoot } from 'src/types/IShoot';

@Injectable()
export class FieldService {
  constructor(private prisma: PrismaClient) {}

  async createField(playerId: number, field: IField) {
    const foundField = await this.prisma.fields.findFirst({
      where: {
        playerId,
      },
    });
    if (foundField)
      await this.prisma.fields.delete({
        where: {
          id: foundField.id,
        },
      });
    const { ships, width, height } = field;
    const fieldCreated = await this.prisma.fields.create({
      data: {
        width,
        height,
        playerId,
      },
    });
    for (const ship of ships) {
      await this.prisma.ships.create({
        data: {
          fieldId: fieldCreated.id,
          ...ship,
          decks: {
            createMany: {
              data: ship.decks,
            },
          },
        },
      });
    }
  }

  async getField(playerId: number) {
    return await this.prisma.fields.findFirst({
      where: { playerId },
      include: {
        ships: {
          include: {
            decks: true,
          },
        },
      },
    });
  }

  async updateField(x: number, y: number, playerId: number, resp: IShoot) {
    const field = await this.getField(playerId);
    for (const sh of field.ships) {
      for (const deck of sh.decks) {
        if (deck.x === x && deck.y === y)
          await this.prisma.decks.update({
            where: { id: deck.id },
            data: { isDamaged: true },
          });
        if (resp.isDestroyed)
          await this.prisma.ships.update({
            where: { id: sh.id },
            data: { isDestroyed: true },
          });
      }
    }
  }

  async removeField(playerId: number) {
    const foundField = await this.prisma.fields.findFirst({
      where: { playerId },
    });
    if (foundField)
      await this.prisma.fields.delete({ where: { id: foundField.id } });
  }
}
