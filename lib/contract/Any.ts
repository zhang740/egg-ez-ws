// ANY TO ANY
import { BaseEvent } from '../common/BaseEvent';

/** 调试专用 */
export class DebugEvent extends BaseEvent {}

/** 到客户端消息 */
export class ClientMessageEvent extends BaseEvent<{
  clientId: string;
  msg: { type: string; data: any };
  evtId?: string;
}> {}
