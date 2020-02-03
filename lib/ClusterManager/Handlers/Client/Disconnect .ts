import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT } from '../../../contract';

export class ClientDisconnectHandler extends BaseEventHandler<
  WORKER_TO_AGENT.ClientDisconnectEvent
> {
  eventType = WORKER_TO_AGENT.ClientDisconnectEvent;

  async processor(evt: WORKER_TO_AGENT.ClientConnectEvent): Promise<void> {
    this.manager.clientDisconnect(evt.data);
  }
}
