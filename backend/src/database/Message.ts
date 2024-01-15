import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Conversation } from './Conversation';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.messageSender, { eager: true })
  sender: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @Column()
  message: string;

  @Column({ nullable: true })
  timestamp: Date;

  @Column({default: false})
  read: boolean;
}
