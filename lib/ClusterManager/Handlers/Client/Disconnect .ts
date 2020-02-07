import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT } from '../../../contract';
import { ClientInfoResponseEvent } from '../../../contract/A_W';

export class ClientDisconnectHandler extends BaseEventHandler<
  WORKER_TO_AGENT.ClientDisconnectEvent
> {
  eventType = WORKER_TO_AGENT.ClientDisconnectEvent;

  async processor(evt: WORKER_TO_AGENT.ClientConnectEvent) {
    const client = this.manager.getClient(evt.data.id);
    if (client) {
      const newEvt = new ClientInfoResponseEvent(
        {
          id: evt.id,
          info: client.ext.info,
          data: client.ext.data,
          roomIds: [...client.rooms.values()].map(room => room.id),
        },
        evt.id
      );
      await this.manager.clientDisconnect(evt.data);
      return newEvt;
    }
  }
}
