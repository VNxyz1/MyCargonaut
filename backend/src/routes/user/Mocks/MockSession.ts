import { User } from '../../../database/User';

export class MockSession {
  isLoggedIn?: boolean;
  userData?: User;
  constructor(running?: boolean) {
    this.isLoggedIn = false;
    this.userData = new User();

    if (running) {
      this.isLoggedIn = true;
    }
  }
}
