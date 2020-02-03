import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT } from '../../../contract';

export class ClientConnectHandler extends BaseEventHandler<WORKER_TO_AGENT.ClientConnectEvent> {
  eventType = WORKER_TO_AGENT.ClientConnectEvent;

  async processor(evt: WORKER_TO_AGENT.ClientConnectEvent): Promise<void> {
    this.manager.clientConnect(evt.data);
  }
}
