import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FieldService } from './field.service';

@Controller('field')
export class FieldController {
  constructor(private fieldService: FieldService) {}

  @Post('create')
  async createField(@Body() dto: any) {
    return this.fieldService.createField(dto.playerId, dto.field);
  }

  @Get(':playerId')
  async getField(@Param('playerId') id: string) {
    return await this.fieldService.getField(+id);
  }
}
