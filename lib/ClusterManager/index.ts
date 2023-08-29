import { Agent } from 'egg';
import { application, lazyInject } from 'egg-aop';
import { IRoomInfo, IClientInfo } from '../contract';
import { BaseEventHandler } from './Handlers/BaseEventHandler';
import { BaseManager } from '../common';
import { IDataSyncService } from '../DataSync';
import { RoomInfo } from './RoomInfo';
import { ClientInfo } from './ClientInfo';

export { RoomInfo, ClientInfo };

@application()
export class ClusterManager extends BaseManager<Agent> {
  readonly logger = this.app.getLogger('ClusterManager');

  @lazyInject()
  public dataSyncService: IDataSyncService;

  get nodeId() {
    return this.dataSyncService.nodeId;
  }

  registerEventHandler(HandlerType: any) {
    const handler: BaseEventHandler = new HandlerType(this);
    this.eventHandlers.set(handler.eventType.name, handler);
  }

  async clientConnect(info: IClientInfo, pid?: number) {
    this.logger.debug('[cluster] client connect', info);
    const client = new ClientInfo(info, this.nodeId, pid);
    await this.dataSyncService.setClient(client);
    return client;
  }

  async clientDisconnect(clientId: string) {
    this.logger.debug('[cluster] client disconnect', clientId);
    await this.dataSyncService.delClient(clientId);
  }

  async getClient(id: string) {
    return this.dataSyncService.getClient(id);
  }

  async updateClient(client: ClientInfo) {
    return this.dataSyncService.setClient(client);
  }

  async getRoomIds() {
    return this.dataSyncService.getRoomIds();
  }

  async getRoom(id: string) {
    return this.dataSyncService.getRoom(id);
  }

  async joinRoom(clientId: string, roomId: string): Promise<boolean> {
    const client = await this.dataSyncService.getClient(clientId);
    if (!client) return false;
    const room = await this.getRoom(roomId);
    if (!room) {
      this.logger.info('[cluster] create room', roomId);
      const room = new RoomInfo({ id: roomId });
      await this.dataSyncService.setRoom(room);
      return this.joinRoom(clientId, roomId);
    }
    this.logger.info('[cluster] join room', clientId, roomId);
    await this.dataSyncService.joinRoom(clientId, roomId);
    return true;
  }

  async exitRoom(clientId: string, roomId: string): Promise<void> {
    this.logger.info('[cluster] exit room', clientId, roomId);
    await this.dataSyncService.exitRoom(clientId, roomId);
  }
}
