import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { TripRequest } from './TripRequest';

@Entity()
export class TripRequestOffering {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requestedCoins: number;

  @Column()
  text: string;

  @Column({ default: false })
  accepted: boolean;

  @ManyToOne(() => User, { eager: true })
  offeringUser: User;

  @ManyToOne(() => TripRequest)
  tripRequest: TripRequest;
}
