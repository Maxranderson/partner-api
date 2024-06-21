import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ReserveSpotsDto } from './dto/reserve-spots.dto';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createEventDto: CreateEventDto) {
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
      },
    });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  findOne(id: string) {
    return this.prismaService.event.findUnique({
      where: { id },
    });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      data: {
        ...updateEventDto,
        date: new Date(updateEventDto.date),
      },
      where: { id },
    });
  }

  remove(id: string) {
    return this.prismaService.event.delete({
      where: { id },
    });
  }

  async reserveSpots(eventId: string, dto: ReserveSpotsDto) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: eventId,
        name: {
          in: dto.spots,
        },
      },
    });
    if (spots.length !== dto.spots.length) {
      const spotNames = spots.map((s) => s.name);
      const spotsNameNotFound = dto.spots.filter((s) => !spotNames.includes(s));
      throw new Error(`Spots ${spotsNameNotFound.join(', ')} not found`);
    }
    try {
      const tickets = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.reservationHistory.createMany({
            data: spots.map((s) => ({
              spotId: s.id,
              ticketKind: dto.ticket_kind,
              email: dto.email,
              status: TicketStatus.reserved,
            })),
          });
          await prisma.spot.updateMany({
            data: {
              status: SpotStatus.reserved,
            },
            where: {
              eventId,
              name: {
                in: dto.spots,
              },
            },
          });

          const tickets = await Promise.all(
            spots.map((s) =>
              prisma.ticket.create({
                data: {
                  spotId: s.id,
                  email: dto.email,
                  ticketKind: dto.ticket_kind,
                },
              }),
            ),
          );
          return tickets;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );

      return tickets;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          //Unique constraint violation. Only 1 ticket for the same spot
          case 'P2002':
          //Transaction conflict. 2 Transaction trying to change the same record
          case 'P2034':
            throw new Error('Some spots are already reserved');
        }
        throw e;
      }
    }
  }
}
