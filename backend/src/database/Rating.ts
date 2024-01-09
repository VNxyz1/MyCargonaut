import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { User } from './User';
  import { Offer } from './Offer';
  
  @Entity()
  export class Rating {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.ratingsAsRater, { eager: true })
    rater: User;

    @ManyToOne(() => User, (user) => user.ratingsAsRated, { eager: true })
    rated: User;

    @ManyToOne(() => Offer, (offer) => offer.ratings, { eager: true })
    trip: Offer;

    @Column()
    driver: boolean;

    @Column()
    totalRating: number;

    @Column({ nullable: true})
    punctuality: number;

    @Column({ nullable: true})
    reliability: number;

    @Column({ nullable: true})
    comfortDuringTrip: number;

    @Column({ nullable: true})
    cargoArrivedUndamaged: number;

    @Column({ nullable: true})
    passengerPleasantness: number;

    @Column({ default: false })
    complete: boolean;
  }