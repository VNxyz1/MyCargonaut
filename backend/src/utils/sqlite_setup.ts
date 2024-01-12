import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { User } from '../database/User';
import { Offer } from '../database/Offer';
import { Plz } from '../database/Plz';
import { TransitRequest } from '../database/TransitRequest';
import { RoutePart } from '../database/RoutePart';

export const entityArr: EntityClassOrSchema[] = [
  User,
  Offer,
  Plz,
  TransitRequest,
  RoutePart,
];

export const sqlite_setup = (path: string) => {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    database: path,
    entities: entityArr,
    synchronize: true,
  });
};
