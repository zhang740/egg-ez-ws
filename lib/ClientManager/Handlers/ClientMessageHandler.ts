import { BaseEventHandler } from './BaseEventHandler';
import { ANY } from '../../contract';

export class ClientMessageHandler extends BaseEventHandler<ANY.ClientMessageEvent> {
  eventType = ANY.ClientMessageEvent;

  async processor(evt: ANY.ClientMessageEvent): Promise<void> {
    const client = this.manager.getClient(evt.data.clientId);
    if (client) {
      client.sendEvent(evt);
    }
    // 只处理当前 Worker 连接的客户端
  }
}
