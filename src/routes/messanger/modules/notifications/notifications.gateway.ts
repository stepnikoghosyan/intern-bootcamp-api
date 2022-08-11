import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  // WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateOrUpdateMessageDto } from '../../dto/message.dto';
import { MessangerEvents } from './models/message-events.model';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway {
  // @WebSocketServer()
  // server: Server;

  @SubscribeMessage(MessangerEvents.SendMessage)
  findAll(
    @MessageBody() data: CreateOrUpdateMessageDto,
  ): Observable<WsResponse<any>> {
    return of({
      event: 'apero',
      data: 'hopar',
    });
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
