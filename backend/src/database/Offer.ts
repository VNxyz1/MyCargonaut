import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "./User";

@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    provider: User;

    @Column()
    startPlz: number;

    @Column()
    endPlz: number;

    @Column()
    createdAt: Date;

    @ManyToMany(() => User, user => user.trips)
    clients: User[];

    //TODO
    @Column()
    vehicle: string;

    @Column({ default: 0 })
    bookedSeats: number;

    //Todo
    @Column()
    state: number;

    @Column()
    description: string;

    @Column()
    startDate: Date;

}
