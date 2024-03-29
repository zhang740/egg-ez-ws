import * as uuid from 'uuid';
import * as WebSocket from 'ws';
import { ClientMessageEvent } from '../contract/Any';
import { BaseEvent } from '../common';

export interface IMessage<T = any> {
  type: string;
  data: T;
  evtId: string;
  timestamp: number;
}

export class Client {
  readonly id = uuid.v4();
  isAuthorized: boolean = false;
  isNode: boolean = false;
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

  sendMessage(msg: { type: string; success?: boolean; data: any }, evtId: string) {
    this.sendEvent(
      new ClientMessageEvent({
        fromId: this.id,
        clientId: this.id,
        msg,
        evtId,
      })
    );
  }
}
