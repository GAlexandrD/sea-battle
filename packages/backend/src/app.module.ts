import { Module } from '@nestjs/common';
import { GameModule } from './modules/game/game.module';
import { FieldModule } from './modules/field/field.module';

@Module({
  imports: [GameModule, FieldModule],
})
export class AppModule {}
