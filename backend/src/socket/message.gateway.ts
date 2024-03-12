import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessageGatewayService } from './message.gateway.service';

@WebSocketGateway()
export class MessageGateway implements OnGatewayConnection {
  constructor(private readonly messageGatewayService: MessageGatewayService) {}

  @SubscribeMessage('userId')
  handleConnection(@ConnectedSocket() socket: Socket, @MessageBody('id') id: number): void {
    if (id == undefined) {
      return;
    }
    this.messageGatewayService.handleConnection(socket, id);
  }
}
