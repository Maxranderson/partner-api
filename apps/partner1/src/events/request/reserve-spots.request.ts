import { TicketKind } from '@prisma/client';

export class ReserveSpotsRequest {
  spots: string[];
  ticket_kind: TicketKind;
  email: string;
}
