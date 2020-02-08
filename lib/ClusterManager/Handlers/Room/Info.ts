import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT, IClientInfo } from '../../../contract';
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
        data: room.ext.data,
        gmtCreated: room.ext.gmtCreated,
        clients: [...room.clients.values()].map(c => {
          return {
            id: c.id,
            info: c.ext.info,
            data: c.ext.data,
            gmtCreated: c.ext.gmtCreated,
          } as IClientInfo;
        }),
      },
      evt.id
    );
  }
}
