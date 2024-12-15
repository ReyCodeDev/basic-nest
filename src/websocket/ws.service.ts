import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';

/**
 * Class that create a websocket.io service
 * @implements OnModuleInit
 */
@WebSocketGateway()
export class WsService implements OnModuleInit {
  @WebSocketServer()
  private readonly server: Server;
  private readonly MAIN_EMIT_CHANNEL: string = 'onMessage';
  onModuleInit(): any {
    this.server.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);
    });
  }

  /**
   * Receives a message from the channel newMessage
   * @param body
   */
  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: JSON) {
    this.emitMessage(this.MAIN_EMIT_CHANNEL, body);
  }

  /**
   * Emits a message
   * @param channel that is going to send the message
   * @param msg the expected JSON to send
   * @private
   */
  private emitMessage(channel: string, msg: JSON) {
    this.server.emit(channel, msg);
  }
}
