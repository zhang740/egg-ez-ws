import { ClientInfo, RoomInfo } from '../ClusterManager';
import { BaseEvent } from '../common';
import { IDataSyncService } from './IDataSyncService';

export class LocalDataSyncService extends IDataSyncService {
  private rooms = new Map<string, RoomInfo>();
  private clients = new Map<string, ClientInfo>();

  nodeId = 'Local';

  async getClient(id: string): Promise<ClientInfo> {
    return this.clients.get(id);
  }

  async setClient(clientInfo: ClientInfo): Promise<boolean> {
    this.clients.set(clientInfo.id, clientInfo);
    return true;
  }

  async delClient(id: string): Promise<boolean> {
    const client = await this.getClient(id);
    if (client) {
      await Promise.all(client.roomIds.map(roomId => this.exitRoom(client.id, roomId)));
      this.clients.delete(id);
    }
    return true;
  }

  async getRoom(id: string): Promise<RoomInfo> {
    return this.rooms.get(id);
  }

  async setRoom(roomInfo: RoomInfo): Promise<boolean> {
    this.rooms.set(roomInfo.id, roomInfo);
    return true;
  }

  async getRoomIds(): Promise<string[]> {
    return [...this.rooms.keys()];
  }

  async joinRoom(clientId: string, roomId: string): Promise<boolean> {
    const client = await this.getClient(clientId);
    const room = await this.getRoom(roomId);
    if (!client || !roomId) {
      return false;
    }
    client.roomIds.push(roomId);
    room.clientIds.push(clientId);
    return true;
  }

  async exitRoom(clientId: string, roomId: string): Promise<boolean> {
    const client = await this.getClient(clientId);
    if (client) {
      const index = client.roomIds.indexOf(roomId);
      if (index >= 0) {
        client.roomIds.splice(index, 1);
      }
    }
    const room = await this.getRoom(roomId);
    if (room) {
      const index = room.clientIds.indexOf(clientId);
      if (index >= 0) {
        room.clientIds.splice(index, 1);
      }
      if (!room.clientIds.length) {
        await this.delRoom(roomId);
      }
    }
    return true;
  }

  private async delRoom(id: string): Promise<boolean> {
    this.rooms.delete(id);
    return true;
  }

  async sendTo(nodeId: string, evt: BaseEvent<{}>): Promise<boolean> {
    throw new Error('NotImpl MultiServer Broadcast!');
  }
}
