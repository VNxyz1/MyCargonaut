import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { TransitRequest } from './TransitRequest';
import { RoutePart } from './RoutePart';
import { Rating } from './Rating';
import { Vehicle } from './Vehicle';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  provider: User;

  @OneToMany(() => RoutePart, (rP) => rP.offer, { eager: true, cascade: true })
  route: RoutePart[];

  @Column({
    nullable: true,
    default: new Date().toISOString(),
  })
  createdAt: string;

  @ManyToMany(() => User, (user) => user.trips, { eager: true })
  clients: User[];

 
  @ManyToOne(()=> Offer, (offer) => offer.vehicle,)
  vehicle: Vehicle;

  @Column({ default: 0 })
  bookedSeats: number;

  @Column()
  state: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  startDate: Date;

  @OneToMany(() => TransitRequest, (transitRequest) => transitRequest.offer, {
    eager: true,
  })
  transitRequests: TransitRequest[];

  @OneToMany(() => Rating, (rating) => rating.trip)
  ratings: Rating[];
}
