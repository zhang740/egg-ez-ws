import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT } from '../../../contract';

export class RoomJoinHandler extends BaseEventHandler<WORKER_TO_AGENT.JoinRoomEvent> {
  eventType = WORKER_TO_AGENT.JoinRoomEvent;

  async processor(evt: WORKER_TO_AGENT.JoinRoomEvent): Promise<void> {
    this.manager.joinRoom(evt.data.clientId, evt.data.roomId);
  }
}
