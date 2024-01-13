import { AverageRatings } from "../interfaces/Rating";

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
