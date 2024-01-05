import { CreateRoutePartDto } from '../../offer/DTOs/CreateRoutePartDto';

export class MockCreateOffer {
  route: CreateRoutePartDto[] = [
    { plz: '12345', location: 'test', position: 1 },
    { plz: '67890', location: 'test', position: 2 },
  ];

  vehicle: string = 'Test Vehicle';

  description: string = 'Test Description';

  startDate: string = '2023-01-02';

  bookedSeats: number = 1;

  createdAt: Date = new Date('2022-01-01T00:00:00.000Z');
}
