import { User } from '../database/User';

export interface ISession {
  isLoggedIn?: boolean;
  userData?: User;
}
