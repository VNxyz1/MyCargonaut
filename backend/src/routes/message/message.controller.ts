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
import { OfferService } from '../offer.service/offer.service';
import { IsLoggedInGuard } from '../../guards/auth/is-logged-in.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OKResponseWithMessageDTO } from '../../generalDTOs/OKResponseWithMessageDTO';
import { ISession } from '../../utils/ISession';
import { CreateMessageDto } from './DTOs/CreateMessageRequestDTO';
import { CreateTripMessageDto } from './DTOs/CreateTripMessageRequestDTO';
import { GetAllMessagesDto } from './DTOs/GetAllMessagesResponseDTO';
import { GetConversationDto } from './DTOs/GetConversationResponseDTO';
import { GetMessageDto } from './DTOs/GetMessageResponseDTO';
import { Message } from '../../database/Message';
import { Offer } from '../../database/Offer';
import { Conversation } from '../../database/Conversation';
import { MessageGatewayService } from '../../socket/message.gateway.service';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly offerService: OfferService,
    private readonly messageGatewayService: MessageGatewayService,
  ) {}

  @UseGuards(IsLoggedInGuard)
  @Get()
  @ApiOperation({
    summary: 'Gets all messages',
    description: `Returns all messages of the logged-in user.`,
  })
  @ApiResponse({ type: GetAllMessagesDto })
  @ApiResponse({
    status: 403,
    type: ForbiddenException,
    description: 'Forbidden resource.',
  })
  async getAllMessages(@Session() session: ISession) {
    const user = await this.userService.getUserById(session.userData.id);

    const conversations = await this.messageService.getAllConversations(
      user.id,
    );

    const getAllMessagesDto: GetAllMessagesDto = new GetAllMessagesDto();
    getAllMessagesDto.conversations = [];

    for (const conversation of conversations) {
      const getConversationDto: GetConversationDto = new GetConversationDto();

      const isUser1 = conversation.user1.id == user.id;
      getConversationDto.conversationId = conversation.id;
      getConversationDto.conversationPartnerId = isUser1
        ? conversation.user2.id
        : conversation.user1.id;
      getConversationDto.conversationPartnerName = isUser1
        ? `${conversation.user2.firstName} ${conversation.user2.lastName}`
        : `${conversation.user1.firstName} ${conversation.user1.lastName}`;
      getConversationDto.messages = [];

      for (const message of conversation.messages) {
        const messageDto: GetMessageDto = new GetMessageDto();
        messageDto.senderId = message.sender.id;
        messageDto.message = message.message;
        messageDto.timestamp = message.timestamp.toISOString();

        if (message.sender.id != user.id) {
          messageDto.read = message.read;
        }

        getConversationDto.messages.push(messageDto);
      }

      getAllMessagesDto.conversations.push(getConversationDto);
    }

    return getAllMessagesDto;
  }

  @UseGuards(IsLoggedInGuard)
  @Get('/unread')
  @ApiOperation({
    summary: 'Gets all unread messages',
    description: `Returns all unread messages of the logged-in user.`,
  })
  @ApiResponse({ type: GetAllMessagesDto })
  @ApiResponse({
    status: 403,
    type: ForbiddenException,
    description: 'Forbidden resource.',
  })
  async getAllUnreadMessages(@Session() session: ISession) {
    const user = await this.userService.getUserById(session.userData.id);

    return await this.messageService.getUnreadMessages(user.id);
  }

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
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Session() session: ISession,
  ) {
    const sender = await this.userService.getUserById(session.userData.id);
    const receiver = await this.userService.getUserById(
      createMessageDto.receiverId,
    );

    if (sender.id == receiver.id) {
      throw new ForbiddenException(
        false,
        'You cannot send yourself a message.',
      );
    }

    let conversation: Conversation = await this.messageService.getConversation(
      sender.id,
      receiver.id,
    );

    if (conversation == null) {
      const newConversation: Conversation = new Conversation();
      newConversation.user1 = sender;
      newConversation.user2 = receiver;
      newConversation.messages = [];
      conversation =
        await this.messageService.createConversation(newConversation);
    }

    const message: Message = new Message();
    message.sender = sender;
    message.conversation = conversation;
    message.message = createMessageDto.message;
    message.timestamp = new Date(createMessageDto.timestamp); //ToDo In der Datenbank wird for some reason Zeit - 1 Stunde gespeichert
    await this.messageService.createMessage(message);
    this.messageGatewayService.reloadMessages(receiver.id);
    return new OKResponseWithMessageDTO(true, 'Message created successfully.');
  }

  @UseGuards(IsLoggedInGuard)
  @Post('/trip/:tripId')
  @ApiOperation({
    summary: 'Write a message to a trip',
    description: `Allows the driver of an offer to send a message to all clients.`,
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
  async createTripMessage(
    @Param('tripId') tripId: number,
    @Body() createMessageDto: CreateTripMessageDto,
    @Session() session: ISession,
  ) {
    const sender = await this.userService.getUserById(session.userData.id);
    const trip: Offer = await this.offerService.getOffer(tripId);

    if (sender.id != trip.provider.id) {
      throw new ForbiddenException(
        false,
        'You cannot send a message to this trip.',
      );
    }

    for (const client of trip.clients) {
      let conversation: Conversation =
        await this.messageService.getConversation(sender.id, client.id);

      if (conversation == null) {
        const newConversation: Conversation = new Conversation();
        newConversation.user1 = sender;
        newConversation.user2 = client;
        newConversation.messages = [];
        conversation =
          await this.messageService.createConversation(newConversation);
      }

      const message: Message = new Message();
      message.sender = sender;
      message.conversation = conversation;
      message.message = createMessageDto.message;
      message.timestamp = new Date(createMessageDto.timestamp); //ToDo In der Datenbank wird for some reason Zeit - 1 Stunde gespeichert
      await this.messageService.createMessage(message);
      this.messageGatewayService.reloadMessages(client.id);
    }
    return new OKResponseWithMessageDTO(true, 'Message created successfully.');
  }

  @UseGuards(IsLoggedInGuard)
  @Post('/read/:conversationId')
  @ApiOperation({
    summary: 'Mark a conversation as read',
    description: `Allows a logged-in user to mark all messages of a conversation as read.`,
  })
  @ApiResponse({
    status: 200,
    type: OKResponseWithMessageDTO,
    description: 'Messages marked as read.',
  })
  @ApiResponse({
    status: 403,
    type: ForbiddenException,
    description: 'You cannot mark this conversation as read.',
  })
  async markConversationAsRead(
    @Session() session: ISession,
    @Param('conversationId') conversationId: number,
  ) {
    const sender = await this.userService.getUserById(session.userData.id);
    const conversation: Conversation =
      await this.messageService.getConversationById(conversationId);

    if (
      sender.id != conversation.user1.id &&
      sender.id != conversation.user2.id
    ) {
      throw new ForbiddenException(
        false,
        'You cannot mark this conversation as read.',
      );
    }

    await this.messageService.markConversationAsRead(conversationId, sender.id);

    return new OKResponseWithMessageDTO(true, 'Messages marked as read.');
  }
}
