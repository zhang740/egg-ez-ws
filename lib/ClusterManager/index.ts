import { Agent } from 'egg';
import * as uuid from 'uuid';
import { application } from 'egg-aop';
import { IRoomInfo, IClientInfo } from '../contract';
import { BaseEventHandler } from './handlers/BaseEventHandler';
import { BaseManager } from '../common';

class RoomInfo {
  readonly id: string;
  // TODO 同步
  ext = {
    // 对外信息
    info: {},
    // 服务端数据
    data: {},
    /** 创建时间 */
    gmtCreated: Date.now(),
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
  // TODO 同步
  ext = {
    // 对外信息
    info: {},
    // 服务端数据
    data: {},
    /** 创建时间 */
    gmtCreated: Date.now(),
  };
  readonly rooms = new Map<string, RoomInfo>();

  constructor(
    readonly id: string,
    // 是否为本地连接客户端
    public readonly type: ClientType = 'local'
  ) {}
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
    const client = new ClientInfo(info.id);
    this.clients.set(info.id, client);
    return client;
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
    return client;
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
    const hasRoom = await this.getRoom(info.id);
    if (!hasRoom) {
      this.logger.info('[cluster] create room', info);
      const room = new RoomInfo(info);
      // TODO 同步
      this.rooms.set(room.id, room);
    }
  }

  async deleteRoom(roomId: string) {
    const room = await this.getRoom(roomId);
    if (room) {
      this.logger.info('[cluster] delete room', roomId);
      [...room.clients.values()].forEach(client => {
        // TODO 房间关闭通知
      });
      // TODO 同步
      this.rooms.delete(roomId);
    }
  }

  async joinRoom(clientId: string, roomId: string) {
    const client = this.clients.get(clientId);
    if (!client) return false;
    const room = await this.getRoom(roomId);
    if (!room) {
      await this.createRoom({ id: roomId });
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
    const room = await this.getRoom(roomId);
    if (room) {
      room.clients.delete(clientId);
      if (!room.clients.size) {
        this.deleteRoom(room.id);
      }
    }
  }
}
