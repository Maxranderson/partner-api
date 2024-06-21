import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { CriarLugarRequest } from './request/criar-lugar.request';
import { AtualizarLugarRequest } from './request/atualiza-lugar.request';
import { SpotsService } from '@app/core/spots/spots.service';

@Controller('eventos/:eventoId/lugares')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(
    @Body() request: CriarLugarRequest,
    @Param('eventoId') eventoId: string,
  ) {
    return this.spotsService.create(eventoId, {
      name: request.nome,
    });
  }

  @Get()
  findAll(@Param('eventoId') eventoId: string) {
    return this.spotsService.findAll(eventoId);
  }

  @Get(':lugarId')
  findOne(
    @Param('lugarId') lugarId: string,
    @Param('eventoId') eventoId: string,
  ) {
    return this.spotsService.findOne(eventoId, lugarId);
  }

  @Patch(':lugarId')
  update(
    @Param('lugarId') lugarId: string,
    @Param('eventoId') eventoId: string,
    @Body() request: AtualizarLugarRequest,
  ) {
    return this.spotsService.update(eventoId, lugarId, { name: request.nome });
  }

  @HttpCode(204)
  @Delete(':lugarId')
  remove(
    @Param('lugarId') lugarId: string,
    @Param('eventoId') eventoId: string,
  ) {
    return this.spotsService.remove(eventoId, lugarId);
  }
}
