import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['eMail'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  eMail: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ default: '' })
  profilePicture: string;

  @Column({ nullable: true, default: '' })
  phoneNumber: string;

  @Column({ default: 0 })
  coins: number;

  @Column({ default: '' })
  description: string;

  @Column({
    nullable: true,
    default: new Date().toISOString(),
  })
  entryDate: Date;
}
