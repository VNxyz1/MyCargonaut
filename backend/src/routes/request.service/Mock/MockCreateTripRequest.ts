import { User } from '../../../database/User';
import { Plz } from '../../../database/Plz';

export class MockCreateTripRequest {
  id: undefined;

  requester: User;

  startPlz: Plz;

  endPlz: Plz;

  createdAt: string;

  cargoImg: string = 'test/path/img.jpg';

  description: string = 'test description.';

  startDate: Date = new Date('2028-02-02');

  seats: number;

  open: true;

  offerings: [];

  constructor(user: User, startPlz: Plz, endPlz: Plz, seats: number) {
    this.requester = user;
    this.startPlz = startPlz;
    this.endPlz = endPlz;
    this.seats = seats;
  }
}
