import { CreatePlzDto } from '../../offer/DTOs/CreatePlzDto';

export class MockUpdateTripRequest {
  startPlz?: CreatePlzDto;

  endPlz?: CreatePlzDto;

  cargoImg?: File;

  description?: string;

  startDate?: string;

  seats?: number;

  cargoImgString?: string | undefined;

  constructor(
    startPlz?: boolean,
    endPlz?: boolean,
    description?: boolean,
    startDate?: boolean,
    seats?: boolean,
  ) {
    this.startPlz = startPlz ? { plz: '12345', location: 'City1' } : undefined;
    this.endPlz = endPlz ? { plz: '67890', location: 'City2' } : undefined;
    this.description = description ? 'Updated test description' : undefined;
    this.startDate = startDate ? '2025-05-05' : undefined;
    this.seats = seats ? 1 : undefined;
  }
}
