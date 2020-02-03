import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT } from '../../../contract';

export class RoomExitHandler extends BaseEventHandler<WORKER_TO_AGENT.ExitRoomEvent> {
  eventType = WORKER_TO_AGENT.ExitRoomEvent;

  async processor(evt: WORKER_TO_AGENT.ExitRoomEvent): Promise<void> {
    this.manager.exitRoom(evt.data.clientId, evt.data.roomId);
  }
}