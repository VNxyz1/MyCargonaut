import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class MessageGatewayService {
  private readonly connectedClients: Map<number, Socket> = new Map();

  handleConnection(socket: Socket, userId: number): void {
    this.connectedClients.set(userId, socket);

    socket.on('disconnect', () => {
      this.connectedClients.delete(userId);
    });
  }

  reloadMessages(userId: number) {
    const socket = this.connectedClients.get(userId);
    if (socket == undefined) {
      return;
    }
    socket.emit('unreadMessages', {});
  }
}
