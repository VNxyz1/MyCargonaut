import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Offer } from './Offer';

@Entity()
export class ReservedCoin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservedCoinsForTrips, { eager: true })
  user: User;

  @ManyToOne(() => Offer, (offer) => offer.reservedCoins, { eager: true })
  trip: Offer;

  @Column()
  amount: number;
}
