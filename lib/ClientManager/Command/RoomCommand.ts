import { BaseCommandProcessor } from './BaseCommandProcessor';
import { Client } from '../Client';
import {
  JoinRoomEvent,
  ExitRoomEvent,
  RoomInfoRequestEvent,
  RoomMessageEvent,
  ClientInfoRequestEvent,
} from '../../contract/W_A';
import { RoomInfoResponseEvent, ClientInfoResponseEvent } from '../../contract/A_W';

export interface RoomCommandRequest {
  roomId?: string;
}
export interface RoomCommandResponse {
  type: 'ROOM_JOIN' | 'ROOM_EXIT' | 'ROOM_INFO';
  data: any;
}
export class RoomJoinCommandProcessor extends BaseCommandProcessor {
  tester = 'ROOM_JOIN';

  async onMessage(client: Client, msg: RoomCommandRequest = {}): Promise<void> {
    const clientInfo = await this.manager.broadcast(
      new ClientInfoRequestEvent({ clientId: client.id }),
      ClientInfoResponseEvent
    );

    const response: RoomCommandResponse = {
      type: 'ROOM_JOIN',
      data: clientInfo
        ? {
            clientId: clientInfo.data.id,
            info: clientInfo.data.info,
          }
        : {},
    };

    this.manager.broadcast(
      new JoinRoomEvent({
        clientId: client.id,
        roomId: msg.roomId,
      })
    );

    this.manager.broadcast(new RoomMessageEvent({ roomId: msg.roomId, msg: response }));
  }
}

export class RoomExitCommandProcessor extends BaseCommandProcessor {
  tester = 'ROOM_EXIT';

  async onMessage(client: Client, msg: RoomCommandRequest = {}): Promise<void> {
    const response: RoomCommandResponse = {
      type: 'ROOM_EXIT',
      data: {
        clientId: client.id,
      },
    };

    this.manager.broadcast(
      new ExitRoomEvent({
        clientId: client.id,
        roomId: msg.roomId,
      })
    );
    client.sendMessage(response);
  }
}

export class RoomInfoCommandProcessor extends BaseCommandProcessor {
  tester = 'ROOM_INFO';

  async onMessage(client: Client, msg: RoomCommandRequest = {}): Promise<void> {
    const info = await this.manager.broadcast(
      new RoomInfoRequestEvent({
        roomId: msg.roomId,
      }),
      RoomInfoResponseEvent
    );

    if (info) {
      info.data.clients = info.data.clients.map(c => ({ id: c.id, info: c.info }));
    }

    const response: RoomCommandResponse = {
      type: 'ROOM_INFO',
      data: info,
    };

    client.sendMessage(response);
  }
}
