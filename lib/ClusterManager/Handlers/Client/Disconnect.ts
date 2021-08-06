import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT, AGENT_TO_WORKER } from '../../../contract';

export class ClientDisconnectHandler extends BaseEventHandler<WORKER_TO_AGENT.ClientDisconnectEvent> {
  eventType = WORKER_TO_AGENT.ClientDisconnectEvent;

  async processor(evt: WORKER_TO_AGENT.ClientConnectEvent) {
    const client = await this.manager.getClient(evt.data.id);
    if (client) {
      const newEvt = new AGENT_TO_WORKER.ClientInfoResponseEvent(
        {
          id: client.id,
          info: client.ext.info,
          data: client.ext.data,
          roomIds: [...client.roomIds],
        },
        evt.id,
        evt.pid
      );
      await this.manager.clientDisconnect(evt.data.id);
      return newEvt;
    }
    await this.manager.clientDisconnect(evt.data.id);
  }
}
