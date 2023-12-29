import { CreateRoutePartDto } from '../../offer/DTOs/CreateRoutePartDto';

export class MockCreateOffer {
  route: CreateRoutePartDto[] = [
    { plz: '12345', position: 1 },
    { plz: '67890', position: 2 },
  ];

  vehicle: string = 'Test Vehicle';

  description: string = 'Test Description';

  startDate: Date = new Date('2023-01-02T00:00:00.000Z');

  bookedSeats: number = 1;

  createdAt: Date = new Date('2022-01-01T00:00:00.000Z');
}
