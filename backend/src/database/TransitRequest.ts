import {Offer} from "./Offer";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class TransitRequest {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    offeredCoins: number;

    @ApiProperty({type: User})
    @ManyToOne(() => User)
    requester: User;

    @ApiProperty({type: Offer})
    @ManyToOne(() => Offer)
    offer: Offer;
}