import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT } from '../../../contract';

export class NoClientHandler extends BaseEventHandler<WORKER_TO_AGENT.NoClientEvent> {
  eventType = WORKER_TO_AGENT.NoClientEvent;

  async processor(evt: WORKER_TO_AGENT.NoClientEvent) {
    await this.manager.clientDisconnect(evt.data.clientId);
    return this.genNoopEvent(evt);
  }
}
