import { ClientInfo, RoomInfo } from '../ClusterManager';
import { BaseEvent } from '../common';
import { DeepReadonly } from '../contract';

export abstract class IDataSyncService {
  /** 获取当前服务器节点 id */
  abstract nodeId: string;
  /** 获取客户端信息 */
  abstract getClient(id: string): Promise<DeepReadonly<ClientInfo> | undefined>;
  /** 设置客户端信息 */
  abstract setClient(clientInfo: ClientInfo): Promise<boolean>;
  /** 删除客户端 */
  abstract delClient(id: string): Promise<boolean>;
  /** 获取房间信息 */
  abstract getRoom(id: string): Promise<DeepReadonly<RoomInfo> | undefined>;
  /** 设置房间信息 */
  abstract setRoom(roomInfo: RoomInfo): Promise<boolean>;
  /** 获取房间列表 */
  abstract getRoomIds(): Promise<string[]>;
  /** 客户端加入房间 */
  abstract joinRoom(clientId: string, roomId: string): Promise<boolean>;
  /** 客户端退出房间 */
  abstract exitRoom(clientId: string, roomId: string): Promise<boolean>;
  /** 发送到节点 */
  abstract sendTo(nodeId: string, evt: BaseEvent): Promise<boolean>;
}
