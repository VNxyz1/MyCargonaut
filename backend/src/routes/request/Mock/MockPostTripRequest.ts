import * as fs from 'fs';
import { join } from 'path';
import { CreatePlzDto } from '../../offer/DTOs/CreatePlzDto';

export class MockPostTripRequest {
  startPlz: CreatePlzDto = { plz: '63679', location: 'Schotten' };

  endPlz: CreatePlzDto = { plz: '35390', location: 'Gießen' };

  description: string = 'Test description';

  startDate: string = '2024-02-02';

  seats: number = 2;

  cargoImg: File;
}

const filePath = join(process.cwd(), 'src', 'routes', 'request', 'Mock', 'user-default-placeholder.png');

export const cargoImg: Express.Multer.File = {
  buffer: fs.readFileSync(filePath),
  destination: './',
  encoding: '7bit',
  fieldname: 'cargoImg',
  filename: 'user-default-placeholder.png',
  mimetype: 'image/png',
  originalname: 'cargoImg',
  path: filePath,
  size: fs.statSync(filePath).size,
  stream: undefined,
};
