import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { VehicleType } from './VehicleType';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  seats: number;

  @Column()
  type: VehicleType;

  @Column()
  description: string;

  @Column({ nullable: true })
  picture: string;

  @ManyToOne(() => User, { eager: true })
  provider: User;
}
