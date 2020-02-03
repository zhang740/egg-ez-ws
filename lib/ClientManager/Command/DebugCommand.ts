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
  data: any;
}
export class DebugCommandProcessor extends BaseCommandProcessor {
  tester = 'DEBUG';

  async onMessage(client: Client, msg: DebugCommandRequest = {}): Promise<void> {
    if (!client.isAdmin || !msg.cmd) return;
    const response: DebugCommandResponse = {
      type: 'DEBUG',
      data: {},
    };

    switch (msg.cmd) {
      case 'RoomList':
        const roomIds = await this.manager.broadcast(
          new RoomListRequestEvent({}),
          RoomListInfoResponseEvent
        );
        response.data = roomIds && roomIds.data;
        break;

      case 'RoomInfo':
        if (!msg.params || !msg.params.length) return;
        const info = await this.manager.broadcast(
          new RoomInfoRequestEvent({
            roomId: msg.params[0],
          }),
          RoomInfoResponseEvent
        );
        response.data = info && info.data;
        break;
    }
    client.sendMessage(response);
  }
}
