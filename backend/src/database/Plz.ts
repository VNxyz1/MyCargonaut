import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Offer} from "./Offer";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Plz {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    plz: string;

    @ManyToMany(() => Offer, offer => offer.route)
    offers: Offer[];
}
