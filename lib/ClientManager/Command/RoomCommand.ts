import { BaseCommandProcessor } from './BaseCommandProcessor';
import { Client } from '../Client';
import { JoinRoomEvent, ExitRoomEvent, RoomInfoRequestEvent } from '../../contract/W_A';
import { RoomInfoResponseEvent } from '../../contract/A_W';

export interface RoomCommandRequest {
  roomId?: string;
}
export interface RoomCommandResponse {
  type: 'ROOM';
  data: any;
}
export class RoomJoinCommandProcessor extends BaseCommandProcessor {
  tester = 'ROOM_JOIN';

  async onMessage(client: Client, msg: RoomCommandRequest = {}): Promise<void> {
    const response: RoomCommandResponse = {
      type: 'ROOM',
      data: {},
    };

    this.manager.broadcast(
      new JoinRoomEvent({
        clientId: client.id,
        roomId: msg.roomId,
      })
    );
    client.sendMessage(response);
  }
}

export class RoomExitCommandProcessor extends BaseCommandProcessor {
  tester = 'ROOM';

  async onMessage(client: Client, msg: RoomCommandRequest = {}): Promise<void> {
    const response: RoomCommandResponse = {
      type: 'ROOM',
      data: {},
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
  tester = 'ROOM';

  async onMessage(client: Client, msg: RoomCommandRequest = {}): Promise<void> {
    const response: RoomCommandResponse = {
      type: 'ROOM',
      data: await this.manager.broadcast(
        new RoomInfoRequestEvent({
          roomId: msg.roomId,
        }),
        RoomInfoResponseEvent
      ),
    };

    client.sendMessage(response);
  }
}
