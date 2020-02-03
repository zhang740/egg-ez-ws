import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT } from '../../../contract';
import { RoomListInfoResponseEvent } from '../../../contract/A_W';

export class RoomListHandler extends BaseEventHandler<WORKER_TO_AGENT.RoomListRequestEvent> {
  eventType = WORKER_TO_AGENT.RoomListRequestEvent;

  async processor(evt: WORKER_TO_AGENT.RoomListRequestEvent) {
    return new RoomListInfoResponseEvent([...(await this.manager.getRoomIds())], evt.id);
  }
}
