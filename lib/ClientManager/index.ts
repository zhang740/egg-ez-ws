import { application } from 'egg-aop';
import { BaseManager } from '../common/BaseManager';
import * as WebSocket from 'ws';
import { Client, IMessage } from './Client';
import { BaseCommandProcessor } from './Command';
import { Application } from 'egg';
import { ClientDisconnectEvent, ClientConnectEvent } from '../contract/W_A';
import { BaseEventHandler } from './Handlers/BaseEventHandler';
import { ClientMessageEvent } from '../contract/Any';
import { BaseEvent } from '../common';
import { ClassType } from '../contract';

@application()
export class ClientManager extends BaseManager<Application> {
  readonly logger = this.app.getLogger('ClientManager');

  private commandProcessors: BaseCommandProcessor[] = [];
  private clients: Map<string, Client> = new Map();

  registerEventHandler(HandlerType: any) {
    const handler: BaseEventHandler = new HandlerType(this);
    this.eventHandlers.set(handler.eventType.name, handler);
  }

  registerCommandProcessor(Type: typeof BaseCommandProcessor) {
    const processor: BaseCommandProcessor = new (Type as any)(this.app, this);
    this.commandProcessors.push(processor);
  }

  unregisterCommandProcessor(Type: typeof BaseCommandProcessor) {
    const index = this.commandProcessors.findIndex(cp => cp instanceof Type);
    if (index >= 0) {
      this.commandProcessors.splice(index, 1);
    }
  }

  createClient(ws: WebSocket) {
    const client = new Client(ws);
    this.clients.set(client.id, client);
    this.broadcast(new ClientConnectEvent({ id: client.id }));

    ws.onmessage = evt => {
      if (evt.type === 'message') {
        try {
          const msg = this.formatMsg(evt.data);
          this.logger.info(
            '[client] ws onmessage',
            msg.type,
            client.id,
            `isAuthorized: ${client.isAuthorized}`,
            `isAdmin: ${client.isAdmin}`
          );
          const processors = this.commandProcessors.filter(cp => {
            return typeof cp.tester === 'string' ? cp.tester === msg.type : cp.tester(msg.type);
          });
          if (!processors.length) {
            this.logger.warn('[client] NotFound Command Processor', client.id, msg);
          }
          processors.forEach(cp => {
            if (cp.needAuth && !client.isAuthorized) {
              this.logger.warn('[NoAuth]', client.id, msg);
            } else {
              cp.onMessage(client, msg.data);
            }
          });
        } catch (error) {
          this.logger.warn('[client] ws onmessage Err!', client.id, evt.data, error);
        }
      }
    };
    ws.onerror = evt => {
      this.logger.warn('[client] Err!', client.id, evt);
    };
    ws.onclose = evt => {
      this.logger.info('[client] onclose', client.id);
      this.clients.delete(client.id);
      this.onSendTo.emit(new ClientDisconnectEvent({ id: client.id }));
    };

    return client;
  }

  /** 广播事件 */
  async broadcast<T extends ClassType>(
    evt: BaseEvent,
    cbType?: T
  ): Promise<InstanceType<T> | void> {
    this.logger.info('[client] broadcast', evt);
    // Worker 内尝试直接分发，找不到则直接抛出
    if (!cbType && evt instanceof ClientMessageEvent) {
      this.eventProcess(evt);
      return;
    }
    return super.broadcast(evt, cbType);
  }

  getClient(id: string) {
    return this.clients.get(id);
  }

  private formatMsg(msg: any): IMessage {
    if (typeof msg !== 'string') {
      return;
    }
    const data = JSON.parse(msg);
    if (!data.type) {
      return;
    }
    return {
      type: data.type,
      data: data.data,
      timestamp: Date.now(),
    };
  }
}