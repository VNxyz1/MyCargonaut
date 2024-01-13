import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Offer } from './Offer';
import { TransitRequest } from './TransitRequest';
import { TripRequest } from './TripRequest';
import { Rating } from './Rating';

@Entity()
@Unique(['eMail'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  eMail: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ default: '' })
  profilePicture: string;

  @Column({ nullable: true, default: '' })
  phoneNumber: string;

  @Column({ default: 0 })
  coins: number;

  @OneToMany(() => Offer, (offer) => offer.provider)
  offers: Offer[];

  @ManyToMany(() => Offer, (offer) => offer.clients)
  @JoinTable()
  trips: Offer[];

  @Column({ default: '' })
  description: string;

  @Column({
    nullable: true,
    default: new Date().toISOString(),
  })
  entryDate: string;

  @OneToMany(() => TransitRequest, (transitRequest) => transitRequest.requester)
  requestedTransits: TransitRequest[];

  @OneToMany(() => TripRequest, (tripRequest) => tripRequest.requester)
  requestedTrips: TripRequest[];

  @OneToMany(() => Rating, (rating) => rating.rated)
  ratingsAsRated: Rating[];

  @OneToMany(() => Rating, (rating) => rating.rater)
  ratingsAsRater: Rating[];
}
