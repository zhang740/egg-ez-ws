import { BaseEventHandler } from '../BaseEventHandler';
import { WORKER_TO_AGENT } from '../../../contract';
import { ClientInfo } from '../../ClientInfo';

export class ClientMergeInfoHandler extends BaseEventHandler<WORKER_TO_AGENT.MergeClientInfoEvent> {
  eventType = WORKER_TO_AGENT.MergeClientInfoEvent;

  async processor(evt: WORKER_TO_AGENT.MergeClientInfoEvent) {
    const client = await this.manager.getClient(evt.data.id);
    if (!client) return;
    await this.manager.updateClient(
      new ClientInfo(
        {
          id: client.id,
          info: evt.data.ext.info || {},
          data: evt.data.ext.data || {},
        },
        client.nodeId,
        evt.pid
      )
    );
    return this.genNoopEvent(evt);
  }
}
