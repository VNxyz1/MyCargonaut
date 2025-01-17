import { Offer } from './Offer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { ApiProperty } from '@nestjs/swagger';
import { GetUserResponseDto } from '../routes/user/DTOs/GetUserResponseDTO';

@Entity()
export class TransitRequest {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  offeredCoins: number;

  @ApiProperty()
  @Column()
  requestedSeats: number;

  @ApiProperty()
  @Column()
  text: string;

  @ApiProperty({ type: GetUserResponseDto })
  @ManyToOne(() => User)
  requester: User;

  @ApiProperty({ type: Offer })
  @ManyToOne(() => Offer)
  offer: Offer;
}
