import { BaseEventHandler } from './BaseEventHandler';
import { ANY } from '../../contract';

export class ClientMessageHandler extends BaseEventHandler<ANY.ClientMessageEvent> {
  eventType = ANY.ClientMessageEvent;

  async processor(evt: ANY.ClientMessageEvent): Promise<void> {
    const client = this.manager.getClient(evt.data.clientId);
    if (client) {
      client.sendEvent(evt);
    } else {
      // Worker 内找不到则直接抛出，manager 中广播方法有处理会回到这里
      this.manager.onSendTo.emit(evt);
    }
  }
}
