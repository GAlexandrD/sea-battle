import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { PrismaClient } from '@prisma/client';
import { FieldModule } from '../field/field.module';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  providers: [GameService, GameGateway, PrismaClient],
  imports: [FieldModule],
  exports: [GameService],
  controllers: [GameController],
})
export class GameModule {}
