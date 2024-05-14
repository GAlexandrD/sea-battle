import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [FieldService, PrismaClient],
  controllers: [FieldController],
  exports: [FieldService],
})
export class FieldModule {}
