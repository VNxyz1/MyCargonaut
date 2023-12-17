import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "./User";
import { Plz } from "./Plz";
import {TransitRequest} from "./TransitRequest";

@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    provider: User;

    @ManyToMany(() => Plz, plz => plz.offers, { eager: true })
    @JoinTable()
    route: Plz[];

    @Column()
    createdAt: Date;

    @ManyToMany(() => User, user => user.trips, { eager: true })
    clients: User[];

    //TODO
    @Column()
    vehicle: string;

    @Column({ default: 0 })
    bookedSeats: number;

    @Column()
    state: number;

    @Column()
    description: string;

    @Column( { nullable: true } )
    startDate: Date;

    @OneToMany(() => TransitRequest, transitRequest => transitRequest.offer, { eager: true })
    transitRequests: TransitRequest[];
}
