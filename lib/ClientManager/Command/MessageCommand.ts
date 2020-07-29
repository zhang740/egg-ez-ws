import { BaseCommandProcessor } from './BaseCommandProcessor';
import { Client, IMessage } from '../Client';
import { ClientMessageEvent } from '../../contract/Any';
import { RoomMessageEvent } from '../../contract/W_A';

export interface MessageCommandRequest {
  type?: 'client' | 'room';
  toId?: string;
  msg?: any;
}
export interface MessageCommandResponse {
  type: 'MESSAGE';
  data: {
    fromId: string;
    msg: any;
  };
}
export class MessageCommandProcessor extends BaseCommandProcessor {
  tester = 'MESSAGE';

  async onMessage(client: Client, req: MessageCommandRequest = {}, evt: IMessage): Promise<void> {
    if (!req.type || !req.toId) return;

    const response: MessageCommandResponse = {
      type: 'MESSAGE',
      data: {
        fromId: client.id,
        msg: req.msg,
      },
    };

    switch (req.type) {
      case 'client':
        this.manager.broadcast(
          new ClientMessageEvent({
            fromId: client.id,
            clientId: req.toId,
            msg: response,
          })
        );
        break;

      case 'room':
        this.manager.broadcast(
          new RoomMessageEvent({
            fromId: client.id,
            roomId: req.toId,
            msg: response,
          })
        );
        break;
    }
  }
}
