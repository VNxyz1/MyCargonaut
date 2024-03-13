import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Offer } from './Offer';
import { Plz } from './Plz';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class RoutePart {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => Plz, { eager: true })
  plz: Plz;

  @ManyToOne(() => Offer)
  offer: Offer;

  @Column()
  @ApiProperty({
    description: 'A higher number means that this location will be traversed later.',
  })
  position: number;
}
