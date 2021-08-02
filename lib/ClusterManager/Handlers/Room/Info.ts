import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT, IClientInfo } from '../../../contract';
import { RoomInfoResponseEvent } from '../../../contract/A_W';

export class RoomInfoHandler extends BaseEventHandler<WORKER_TO_AGENT.RoomInfoRequestEvent> {
  eventType = WORKER_TO_AGENT.RoomInfoRequestEvent;

  async processor(evt: WORKER_TO_AGENT.RoomInfoRequestEvent) {
    const room = await this.manager.getRoom(evt.data.roomId);
    return new RoomInfoResponseEvent(
      room
        ? {
            id: room.id,
            info: room.ext.info,
            data: room.ext.data,
            gmtCreated: room.ext.gmtCreated,
            clients: (
              await Promise.all(
                room.clientIds.map(async cid => {
                  const client = await this.manager.getClient(cid);
                  if (!client) {
                    this.manager.exitRoom(cid, room.id);
                    return;
                  }
                  return {
                    id: client.id,
                    info: client.ext.info,
                    data: client.ext.data,
                    gmtCreated: client.ext.gmtCreated,
                  } as IClientInfo;
                })
              )
            ).filter(Boolean),
          }
        : null,
      evt.id,
      evt.pid
    );
  }
}
