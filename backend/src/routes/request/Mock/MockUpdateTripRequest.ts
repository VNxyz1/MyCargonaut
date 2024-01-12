import { CreatePlzDto } from '../../offer/DTOs/CreatePlzDto';
import * as fs from "fs";
import {join} from "path";

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

const filePath = join(
    process.cwd(),
    'src',
    'routes',
    'request',
    'Mock',
    'user-default-2-placeholder.png',
);

export const cargoImgUpdate: Express.Multer.File = {
  buffer: fs.readFileSync(filePath),
  destination: './',
  encoding: '7bit',
  fieldname: 'cargoImg',
  filename: 'user-default-2-placeholder.png',
  mimetype: 'image/png',
  originalname: 'cargoImg',
  path: filePath,
  size: fs.statSync(filePath).size,
  stream: undefined,
};