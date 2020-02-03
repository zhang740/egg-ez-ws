// WORKER TO AGENT
import { BaseEvent } from '../common/BaseEvent';

/** 客户端连接 */
export class ClientConnectEvent extends BaseEvent<{ id: string }> {}

/** 客户端断开连接 */
export class ClientDisconnectEvent extends BaseEvent<{ id: string }> {}

/** 加入房间 */
export class JoinRoomEvent extends BaseEvent<{ clientId: string; roomId: string }> {}

/** 退出房间 */
export class ExitRoomEvent extends BaseEvent<{ clientId: string; roomId: string }> {}

/** 房间消息 */
export class RoomMessageEvent extends BaseEvent<{
  roomId: string;
  msg: any;
}> {}

/** 房间列表信息 */
export class RoomListRequestEvent extends BaseEvent {}

/** 房间信息 */
export class RoomInfoRequestEvent extends BaseEvent<{
  roomId: string;
}> {}

/** 更新客户端信息 */
export class MergeClientInfoEvent extends BaseEvent<{
  id: string;
  ext: { info?: any; data?: any };
}> {}

/** 更新房间信息 */
export class MergeRoomInfoEvent extends BaseEvent<{
  id: string;
  ext: { info?: any; data?: any };
}> {}
