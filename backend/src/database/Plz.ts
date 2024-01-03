import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RoutePart } from './RoutePart';

@Entity()
export class Plz {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  plz: string;

  @Column()
  @ApiProperty()
  location: string;

  @OneToMany(() => RoutePart, (rP) => rP.plz)
  routeParts: RoutePart[];
}
