import { User } from '../../../database/User';
import { MockGetUser } from './MockGetUser';

export class MockSession {
  isLoggedIn?: boolean;
  userData?: User;
  constructor(running?: boolean) {
    this.isLoggedIn = false;
    this.userData = new User();

    if (running) {
      this.isLoggedIn = true;
      this.userData = new MockGetUser(true) as User;
    }
  }
}
