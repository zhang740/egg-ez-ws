import * as uuid from 'uuid';
import * as WebSocket from 'ws';
import { ClientMessageEvent } from '../contract/Any';
import { BaseEvent } from '../common';

export interface IMessage<T = any> {
  type: string;
  data: T;
  timestamp: number;
}

export class Client {
  readonly id = uuid.v4();
  isAuthorized: boolean = false;
  isAdmin: boolean = false;

  constructor(public readonly ws: WebSocket) {}

  sendEvent(evt: BaseEvent) {
    this.ws.send(
      JSON.stringify({
        data: evt.data,
        timestamp: evt.timestamp,
      })
    );
  }

  sendMessage(msg: { type: string; data: any }) {
    this.sendEvent(new ClientMessageEvent({ clientId: this.id, msg }));
  }
}
