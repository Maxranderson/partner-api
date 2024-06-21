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
import { CriarEventoRequest } from './request/criar-evento.request';
import { AtualizarEventoRequest } from './request/atualiza-evento.request';
import { ReservarLugaresRequest } from './request/reservar-lugares.request';
import { EventsService } from '@app/core/events/events.service';
import { TicketKind } from '@prisma/client';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() request: CriarEventoRequest) {
    return this.eventsService.create({
      name: request.nome,
      description: request.descricao,
      date: request.data,
      price: request.preco,
    });
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() atualizarEventoRequest: AtualizarEventoRequest,
  ) {
    return this.eventsService.update(id, {
      name: atualizarEventoRequest.nome,
      description: atualizarEventoRequest.descricao,
      date: atualizarEventoRequest.data,
      price: atualizarEventoRequest.preco,
    });
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/reservas')
  reserveSpots(
    @Body() request: ReservarLugaresRequest,
    @Param('id') eventId: string,
  ) {
    return this.eventsService.reserveSpots(eventId, {
      spots: request.lugares,
      ticket_kind:
        request.tipo_ingresso === 'inteira' ? TicketKind.full : TicketKind.half,
      email: request.email,
    });
  }
}
