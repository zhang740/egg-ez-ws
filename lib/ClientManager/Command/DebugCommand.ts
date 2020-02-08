import { BaseCommandProcessor } from './BaseCommandProcessor';
import { Client } from '../Client';
import { RoomListRequestEvent, RoomInfoRequestEvent } from '../../contract/W_A';
import { RoomListInfoResponseEvent, RoomInfoResponseEvent } from '../../contract/A_W';

export interface DebugCommandRequest {
  cmd?: 'RoomList' | 'RoomInfo';
  params?: any[];
}
export interface DebugCommandResponse {
  type: 'DEBUG';
  data: {
    req: DebugCommandRequest;
    res?: any;
  };
}
export class DebugCommandProcessor extends BaseCommandProcessor {
  tester = 'DEBUG';

  async onMessage(client: Client, msg: DebugCommandRequest = {}): Promise<void> {
    if (!client.isAdmin || !msg.cmd) return;
    const response: DebugCommandResponse = {
      type: 'DEBUG',
      data: {
        req: msg,
      },
    };

    switch (msg.cmd) {
      case 'RoomList':
        const roomIds = await this.manager.broadcast(
          new RoomListRequestEvent({}),
          RoomListInfoResponseEvent
        );
        response.data.res = roomIds && roomIds.data;
        break;

      case 'RoomInfo':
        if (!msg.params || !msg.params.length) return;
        const info = await this.manager.broadcast(
          new RoomInfoRequestEvent({
            roomId: msg.params[0],
          }),
          RoomInfoResponseEvent
        );
        response.data.res = info && info.data;
        break;
    }
    client.sendMessage(response);
  }
}
