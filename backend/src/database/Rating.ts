import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { User } from './User';
  import { Offer } from './Offer';
  import { ApiProperty } from '@nestjs/swagger';
  
  @Entity()
  export class Rating {
    @PrimaryGeneratedColumn()
    id: number;
  
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
  }