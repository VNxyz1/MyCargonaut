import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "./User";
import { Plz } from "./Plz";

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

    //Todo
    @Column()
    state: string;

    @Column()
    description: string;

    @Column()
    startDate: Date;

}
