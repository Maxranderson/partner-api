import { TicketKind } from '@prisma/client';

export class ReserveSpotsDto {
  spots: string[];
  ticket_kind: TicketKind;
  email: string;
}
