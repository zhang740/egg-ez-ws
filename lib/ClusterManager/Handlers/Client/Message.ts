import { BaseEventHandler } from '../BaseEventHandler';
import { ANY } from '../../../contract';

export class ClientMessageHandler extends BaseEventHandler<ANY.ClientMessageEvent> {
  eventType = ANY.ClientMessageEvent;

  async processor(evt: ANY.ClientMessageEvent): Promise<void> {
    const client = this.manager.getClient(evt.data.clientId);
    if (client) {
      this.manager.onSendTo.emit(evt);
      return;
    }
    // TODO 外部广播
    this.manager.logger.error('[cluster] ClientMessageHandler NotImpl MultiServer Broadcast!');
  }
}
