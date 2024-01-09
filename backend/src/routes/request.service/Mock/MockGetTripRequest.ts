import { User } from '../../../database/User';
import { Plz } from '../../../database/Plz';

export class MockGetTripRequest {
  id: number;

  requester: User;

  startPlz: Plz;

  endPlz: Plz;

  createdAt: Date;

  cargoImg: string = 'test/path/img.jpg';

  description: string = 'test description.';

  startDate: Date = new Date('2028-02-02');

  seats: number;

  constructor(user: User, startPlz: Plz, endPlz: Plz, seats: number) {
    this.requester = user;
    this.startPlz = startPlz;
    this.endPlz = endPlz;
    this.seats = seats;
  }
}
