import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT } from '../../../contract';

export class ClientMergeInfoHandler extends BaseEventHandler<WORKER_TO_AGENT.MergeClientInfoEvent> {
  eventType = WORKER_TO_AGENT.MergeClientInfoEvent;

  async processor(evt: WORKER_TO_AGENT.MergeClientInfoEvent): Promise<void> {
    const client = this.manager.getClient(evt.data.id);
    if (!client) return;
    Object.assign(client.ext.info, evt.data.ext.info || {});
    Object.assign(client.ext.data, evt.data.ext.data || {});
  }
}
