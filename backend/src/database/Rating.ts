import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { User } from './User';
  import { Offer } from './Offer';
<<<<<<< HEAD
=======
  import { ApiProperty } from '@nestjs/swagger';
>>>>>>> fe15981 (rebase main)
  
  @Entity()
  export class Rating {
    @PrimaryGeneratedColumn()
    id: number;
  
<<<<<<< HEAD
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
=======
    @ApiProperty()
    @ManyToOne(() => User, { eager: true })
    rater: User;

    @ApiProperty()
    @ManyToOne(() => User, (user) => user.ratings)
    rated: User;

    @ApiProperty({ type: Offer })
    @ManyToOne(() => Offer, (offer) => offer.ratings, {
      eager: true,
    })
    trip: Offer;

    @ApiProperty()
    @Column()
    driver: boolean;

    @ApiProperty()
    @Column()
    totalRating: number;

    @ApiProperty()
    @Column({ nullable: true})
    punctuality: number;

    @ApiProperty()
    @Column({ nullable: true})
    reliability: number;

    @ApiProperty()
    @Column({ nullable: true})
    comfortDuringTrip: number;

    @ApiProperty()
    @Column({ nullable: true})
    cargoArrivedUndamaged: number;

    @ApiProperty()
    @Column({ nullable: true})
    passengerPleasantness: number;
>>>>>>> fe15981 (rebase main)
  }