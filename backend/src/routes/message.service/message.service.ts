import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../../database/Message';
import { Conversation } from '../../database/Conversation';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
    ) {}

    async getConversation(user1: number, user2: number) {
        const conversation = await this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoinAndSelect('conversation.user1', 'user1')
        .leftJoinAndSelect('conversation.user2', 'user2')
        .leftJoinAndSelect('conversation.messages', 'messages')
        .where('user1.id = :user1 AND user2.id = :user2 OR user1.id = :user2 AND user2.id = :user1', {
            user1: user1,
            user2: user2,
        })
        .getOne();

        if (conversation == null) {
            return null;
        }
        return conversation;
    }

    async getConversationById(conversationId: number) {
        const conversation = await this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoinAndSelect('conversation.user1', 'user1')
        .leftJoinAndSelect('conversation.user2', 'user2')
        .leftJoinAndSelect('conversation.messages', 'messages')
        .leftJoinAndSelect('messages.sender', 'sender')
        .where('conversation.id = :conversationId', {conversationId: conversationId})
        .getOne();

        if (conversation == null) {
            throw new NotFoundException(`No Conversation with this Id found.`);
        }
        return conversation;
    }

    async getAllConversations(userId: number) {
        const conversations = await this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoinAndSelect('conversation.user1', 'user1')
        .leftJoinAndSelect('conversation.user2', 'user2')
        .leftJoinAndSelect('conversation.messages', 'messages')
        .leftJoinAndSelect('messages.sender', 'sender')
        .where('user1.id = :userId OR user2.id = :userId', {
            userId: userId,
        })
        .getMany();

        if (conversations == null) {
            return null;
        }
        return conversations;
    }

    async createConversation(conversation: Conversation) {
        return await this.conversationRepository.save(conversation);
    }

    async createMessage(message: Message) {
        return await this.messageRepository.save(message);
    }

    async markConversationAsRead(conversationId: number, userId: number) {
        const conversation = await this.getConversationById(conversationId);

        conversation.messages.forEach(async (message) => {
            if (message.sender.id != userId) {
                message.read = true;
                await this.messageRepository.save(message);
            }
        });
        await this.conversationRepository.save(conversation);
    }
}
