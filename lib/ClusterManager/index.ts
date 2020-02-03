import { Agent } from 'egg';
import * as uuid from 'uuid';
import { application } from 'egg-aop';
import { IRoomInfo, IClientInfo } from '../contract';
import { BaseEventHandler } from './handlers/BaseEventHandler';
import { BaseManager, BaseEvent } from '../common';

class RoomInfo {
  readonly id: string;
  // TODO 同步
  ext = {
    // 对外信息
    info: {},
    // 服务端数据
    data: {},
  };
  // TODO 同步
  readonly clients = new Map<string, ClientInfo>();

  constructor(info: IRoomInfo) {
    this.id = info.id || uuid.v4();
    this.ext.info = info.info || {};
    this.ext.data = info.data || {};
  }
}

type ClientType = 'local' | 'remote';
class ClientInfo {
  // 是否为本地连接客户端
  type: ClientType;
  // TODO 同步
  ext = {
    // 对外信息
    info: {},
    // 服务端数据
    data: {},
  };
  readonly rooms = new Map<string, RoomInfo>();

  constructor(readonly id: string, type: ClientType = 'local') {}
}

@application()
export class ClusterManager extends BaseManager<Agent> {
  readonly logger = this.app.getLogger('ClusterManager');

  private rooms = new Map<string, RoomInfo>();
  private clients = new Map<string, ClientInfo>();

  registerEventHandler(HandlerType: any) {
    const handler: BaseEventHandler = new HandlerType(this);
    this.eventHandlers.set(handler.eventType.name, handler);
  }

  async clientConnect(info: IClientInfo) {
    this.logger.debug('[cluster] client connect', info);
    this.clients.set(info.id, new ClientInfo(info.id));
  }

  async clientDisconnect(info: IClientInfo) {
    this.logger.debug('[cluster] client disconnect', info);
    const client = this.clients.get(info.id);
    if (client) {
      await Promise.all(
        new Array(...client.rooms.keys()).map(roomId => this.exitRoom(client.id, roomId))
      );
      this.clients.delete(info.id);
    }
  }

  getClient(id: string) {
    return this.clients.get(id);
  }

  async getRoomIds() {
    return this.rooms.keys();
  }

  async getRoom(id: string) {
    // TODO 远端查询 room
    return this.rooms.get(id);
  }

  async createRoom(info: IRoomInfo) {
    const hasRoom = this.rooms.has(info.id);
    if (!hasRoom) {
      this.logger.info('[cluster] create room', info);
      const room = new RoomInfo(info);
      this.rooms.set(room.id, room);
    }
  }

  async joinRoom(clientId: string, roomId: string) {
    const client = this.clients.get(clientId);
    if (!client) return false;
    const room = this.rooms.get(roomId);
    if (!room) {
      this.createRoom({ id: roomId });
      return this.joinRoom(clientId, roomId);
    }
    this.logger.info('[cluster] join room', clientId, roomId);
    client.rooms.set(room.id, room);
    room.clients.set(client.id, client);
  }

  async exitRoom(clientId: string, roomId: string) {
    const client = this.clients.get(clientId);
    this.logger.info('[cluster] exit room', clientId, roomId, !!client);
    if (client) {
      client.rooms.delete(roomId);
    }
    const room = this.rooms.get(roomId);
    if (room) {
      room.clients.delete(clientId);
    }
  }
}
