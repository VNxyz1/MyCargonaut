import { CreateRoutePartDto } from '../../offer/DTOs/CreateRoutePartDto';

export class MockUpdateOffer {
  route?: CreateRoutePartDto[] = [
    { plz: '09876', location: 'test', position: 1 },
    { plz: '67890', location: 'test', position: 2 },
  ];

  description?: string = 'musste man mal updaten';

  startDate?: Date = new Date('2002-02-18T00:00:00.000Z');
}
