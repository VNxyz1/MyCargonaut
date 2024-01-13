import { AverageRatings } from "../interfaces/AverageRatings";

export interface User {
    id?: number;
    firstName?: string;
    lastName?: string;
    eMail?: string;
    birthday?: Date;
    phoneNumber?: string;
    description?: string;
    coins?: number;
    profilePicture?: string;
    password?: string;
    entryDate?: Date;
    averageRatings?: AverageRatings;
}
