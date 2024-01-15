import { Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Message } from './Message';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.conversationUser1, { eager: true })
  user1: User;

  @ManyToOne(() => User, (user) => user.conversationUser2, { eager: true })
  user2: User;

  @OneToMany(() => Message, (message) => message.conversation, { eager: true })
  messages: Message[];
}
