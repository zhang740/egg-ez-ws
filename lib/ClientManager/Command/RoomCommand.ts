import { BaseCommandProcessor } from './BaseCommandProcessor';
import { Client, IMessage } from '../Client';
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
  success: boolean;
  data: any;
}
export class RoomJoinCommandProcessor extends BaseCommandProcessor {
  /** 是否将用户进入房间消息广播给其他用户 */
  static BROADCAST_TO_OTHER_IN_ROOM = false;

  tester = 'ROOM_JOIN';

  async onMessage(client: Client, msg: RoomCommandRequest = {}): Promise<void> {
    const clientInfo = await this.manager.broadcast(
      new ClientInfoRequestEvent({ clientId: client.id }),
      ClientInfoResponseEvent
    );

    const response: RoomCommandResponse = {
      type: 'ROOM_JOIN',
      success: true,
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

    if (RoomJoinCommandProcessor.BROADCAST_TO_OTHER_IN_ROOM) {
      this.manager.broadcast(new RoomMessageEvent({ roomId: msg.roomId, msg: response }));
    }
  }
}

export class RoomExitCommandProcessor extends BaseCommandProcessor {
  /** 是否将用户进入房间消息广播给其他用户 */
  static BROADCAST_TO_OTHER_IN_ROOM = false;

  tester = 'ROOM_EXIT';

  async onMessage(client: Client, msg: RoomCommandRequest = {}): Promise<void> {
    const response: RoomCommandResponse = {
      type: 'ROOM_EXIT',
      success: true,
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

    if (RoomExitCommandProcessor.BROADCAST_TO_OTHER_IN_ROOM) {
      this.manager.broadcast(new RoomMessageEvent({ roomId: msg.roomId, msg: response }));
    }
  }
}

export class RoomInfoCommandProcessor extends BaseCommandProcessor {
  tester = 'ROOM_INFO';

  async onMessage(client: Client, msg: RoomCommandRequest = {}, evt: IMessage): Promise<void> {
    const info = await this.manager.broadcast(
      new RoomInfoRequestEvent({
        roomId: msg.roomId,
      }),
      RoomInfoResponseEvent
    );

    if (info) {
      const response: RoomCommandResponse = {
        type: 'ROOM_INFO',
        success: true,
        data: {
          id: info.data.id,
          info: info.data.info,
          clients: info.data.clients.map(c => ({ id: c.id, info: c.info })),
        },
      };

      client.sendMessage(response, evt.evtId);
    }
  }
}
