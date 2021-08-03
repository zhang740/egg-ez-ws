import { BaseEventHandler } from './BaseEventHandler';
import { ANY, WORKER_TO_AGENT } from '../../contract';

export class ClientMessageHandler extends BaseEventHandler<ANY.ClientMessageEvent> {
  eventType = ANY.ClientMessageEvent;

  async processor(evt: ANY.ClientMessageEvent): Promise<void> {
    const client = this.manager.getClient(evt.data.clientId);
    if (client) {
      client.sendEvent(evt);
    } else {
      this.log('warn', '[ClientMessageHandler] NoClientEvent', evt.data.clientId);
      this.manager.broadcast(
        new WORKER_TO_AGENT.NoClientEvent({
          clientId: evt.data.clientId,
        })
      );
    }
  }
}
