import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT } from '../../../contract';
import { ClientInfoResponseEvent } from '../../../contract/A_W';

export class ClientInfoHandler extends BaseEventHandler<WORKER_TO_AGENT.ClientInfoRequestEvent> {
  eventType = WORKER_TO_AGENT.ClientInfoRequestEvent;

  async processor(evt: WORKER_TO_AGENT.ClientInfoRequestEvent) {
    const client = await this.manager.getClient(evt.data.clientId);
    if (!client) {
      return;
    }
    return new ClientInfoResponseEvent(
      {
        id: evt.id,
        info: client.ext.info,
        data: client.ext.data,
        roomIds: [...client.rooms.values()].map(room => room.id),
      },
      evt.id
    );
  }
}
