import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT } from '../../../contract';
import { RoomInfoResponseEvent } from '../../../contract/A_W';

export class RoomInfoHandler extends BaseEventHandler<WORKER_TO_AGENT.RoomInfoRequestEvent> {
  eventType = WORKER_TO_AGENT.RoomInfoRequestEvent;

  async processor(evt: WORKER_TO_AGENT.RoomInfoRequestEvent) {
    const room = await this.manager.getRoom(evt.data.roomId);
    if (!room) {
      return;
    }
    return new RoomInfoResponseEvent(
      {
        id: evt.id,
        info: room.ext.info,
        clients: [...room.clients.values()].map(c => {
          return c;
        }),
      },
      evt.id
    );
  }
}
