import { User } from "../../../database/User";
import { Plz } from "../../../database/Plz";
import { TransitRequest } from "../../../database/TransitRequest";

export class MockPostOfferReturnVal {
    id: number = 1;

    provider = {
        id: 1,
        entryDate: new Date('2021-02-18'),
        eMail: 'tester@test.com',
        firstName: 'Max',
        lastName: 'Mustermann',
        birthday: new Date('2002-02-18'),
        description: 'Test',
        profilePicture: '/profile-pictures/12341.png',
        phoneNumber: '+49 173 55555',
        coins: 0,
        password: '1234'
    };

    route= [
        { plz: '12345' },
        { plz: '67890' },
    ];

    createdAt: Date = new Date('2022-01-01T00:00:00.000Z');

    vehicle: string = 'Test Vehicle';

    bookedSeats: number = 1;

    state: number = 1;

    description: string = 'Test Description';

    startDate: Date = new Date('2023-01-02T00:00:00.000Z');


}
