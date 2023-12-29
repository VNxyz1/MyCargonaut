import {CreatePlzDto} from "../../offer/DTOs/CreatePlzDto";

export class MockCreateOffer {

    route: CreatePlzDto[] = [
        { plz: '12345' },
        { plz: '67890' },
    ];

    vehicle: string = 'Test Vehicle';

    description: string = 'Test Description';

    startDate: Date = new Date('2023-01-02T00:00:00.000Z');

    bookedSeats: number = 1;

    createdAt: Date = new Date('2022-01-01T00:00:00.000Z');

}
