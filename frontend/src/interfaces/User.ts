import { AverageRatings } from "./Rating";

export interface User {

  id: number;

  eMail: string;

  firstName: string;

  lastName: string;

  password: string;

  birthday: Date;
  age: number;

  profilePicture: string;

  phoneNumber: string;

  coins: number;

  description: string;

  entryDate: Date;

  averageRatings: AverageRatings;
}
