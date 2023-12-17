import {Offer} from "./Offer";
import {Column, ManyToOne} from "typeorm";
import {User} from "./User";

export class TransitRequest {

    @Column()
    offeredCoins: number;

    @ManyToOne(() => User)
    requester: User;

    @ManyToOne(() => Offer)
    offer: Offer;
}