// AGENT TO WORKER
import { BaseEvent } from '../common/BaseEvent';
import { IRoomInfo } from './interface';

export class RoomInfoResponseEvent extends BaseEvent<IRoomInfo> {}

export class RoomListInfoResponseEvent extends BaseEvent<string[]> {}
