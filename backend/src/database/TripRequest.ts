import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plz } from './Plz';
import { User } from './User';
@Entity()
export class TripRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  requester: User;

  @ManyToOne(() => Plz, { eager: true })
  startPlz: Plz;

  @ManyToOne(() => Plz, { eager: true })
  endPlz: Plz;

  @Column({ default: new Date().toISOString() })
  createdAt: string;

  @Column({ nullable: true })
  cargoImg: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  seats: number;
}
