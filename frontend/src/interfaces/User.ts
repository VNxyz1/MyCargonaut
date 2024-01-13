import { AverageRatings } from "./AverageRatings";

export interface User {
  id: number;

  eMail: string;

  firstName: string;

  lastName: string;

  password: string;

  birthday: Date;

  profilePicture: string;

  phoneNumber: string;

  coins: number;

  description: string;

  entryDate: Date;

  averageRatings: AverageRatings;
}
