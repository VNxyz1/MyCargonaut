import {
    Controller,
    Get,
    Post,
    Body,
    Session,
    UseGuards,
    Param,
    ForbiddenException,
  } from '@nestjs/common';
import { UserService } from '../user.service/user.service';
import { MessageService } from '../message.service/message.service';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { ISession } from '../../utils/ISession';
import { CreateMessageDto } from './DTOs/CreateMessageRequestDTO';
import { Message } from '../../database/Message';
import { Conversation } from '../../database/Conversation';

@ApiTags('message')
@Controller('message')
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly userService: UserService,
      ) {}

    @UseGuards(IsLoggedInGuard)
    @Post()
    @ApiOperation({
        summary: 'Write a message',
        description: `Allows a logged-in user to write a message to another user.`,
    })
    @ApiResponse({
        status: 201,
        type: OKResponseWithMessageDTO,
        description: 'Message created successfully.',
    })
    @ApiResponse({
        status: 403,
        type: ForbiddenException,
        description: 'Forbidden resource.',
    })
    async createRating(
        @Body() createMessageDto: CreateMessageDto,
        @Session() session: ISession,
    ) {
        const sender = await this.userService.getUserById(session.userData.id);
        const receiver = await this.userService.getUserById(createMessageDto.receiverId);

        if (sender.id == receiver.id) {
            throw new ForbiddenException(false, 'You cannot send yourself a message.');
        }

        let conversation: Conversation = await this.messageService.getConversation(sender.id, receiver.id);

        if (conversation == null) {
            const newConversation: Conversation = new Conversation();
            newConversation.user1 = sender;
            newConversation.user2 = receiver;
            newConversation.messages = [];
            conversation = await this.messageService.createConversation(newConversation);
        }

        const message: Message = new Message();
        message.sender = sender;
        message.conversation = conversation;
        message.message = createMessageDto.message;
        message.timestamp = new Date(createMessageDto.timestamp); //ToDo In der Datenbank wird for some reason Zeit - 1 Stunde gespeichert
        await this.messageService.createMessage(message);

        return new OKResponseWithMessageDTO(true, 'Message created successfully.');
    }
}
