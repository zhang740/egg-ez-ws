import { BaseEventHandler } from '../BaseEventHandler';
import { ANY } from '../../../contract';

export class ClientMessageHandler extends BaseEventHandler<ANY.ClientMessageEvent> {
  eventType = ANY.ClientMessageEvent;

  async processor(evt: ANY.ClientMessageEvent) {
    const client = await this.manager.getClient(evt.data.clientId);
    if (!client) {
      this.log('warn', '[ClientMessageHandler] No Client', evt);
      return;
    }
    // 如果是当前服务节点的客户端，则通知 Workers
    if (client.nodeId === this.manager.nodeId) {
      evt.pid = client.pid;
      this.manager.onSendTo.emit(evt);
    } else {
      this.log('debug', '[ClientMessageHandler] dataSyncService.sendTo', client.nodeId, evt);
      this.manager.dataSyncService.sendTo(client.nodeId, evt);
    }
  }
}
