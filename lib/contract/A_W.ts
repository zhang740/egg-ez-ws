// AGENT TO WORKER
import { BaseEvent } from '../common/BaseEvent';
import { IRoomInfo, IClientInfo } from './interface';

export class ClientInfoResponseEvent extends BaseEvent<IClientInfo> {}

export class RoomInfoResponseEvent extends BaseEvent<IRoomInfo> {}

export class RoomListInfoResponseEvent extends BaseEvent<string[]> {}
