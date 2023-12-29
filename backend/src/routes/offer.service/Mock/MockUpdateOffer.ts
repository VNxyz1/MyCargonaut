import { CreateRoutePartDto } from '../../offer/DTOs/CreateRoutePartDto';

export class MockUpdateOffer {
  route?: CreateRoutePartDto[] = [
    { plz: '09876', position: 1 },
    { plz: '67890', position: 2 },
  ];

  description?: string = 'musste man mal updaten';

  startDate?: Date = new Date('2002-02-18T00:00:00.000Z');
}
