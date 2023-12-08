import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Offer} from "./Offer";

@Entity()
export class Plz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    plz: number;

    @ManyToMany(() => Offer, offer => offer.route)
    offers: Offer[];
}
