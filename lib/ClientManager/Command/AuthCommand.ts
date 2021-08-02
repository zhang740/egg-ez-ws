import { BaseCommandProcessor } from './BaseCommandProcessor';
import { Client, IMessage } from '../Client';
import { MergeClientInfoEvent } from '../../contract/W_A';

export interface AuthCommandRequest {
  key?: string;
  info?: any;
}
export interface AuthCommandResponse {
  type: 'AUTH';
  success: boolean;
  data: {
    isAuthorized?: boolean;
    isAdmin?: boolean;
  };
}
export class AuthCommandProcessor extends BaseCommandProcessor {
  tester = 'AUTH';
  needAuth = false;

  private config = this.app.config.ws;
  private authKey = this.config.authKey;
  private adminKey = this.config.adminKey;

  async onMessage(client: Client, msg: AuthCommandRequest = {}, evt: IMessage): Promise<void> {
    const response: AuthCommandResponse = {
      type: 'AUTH',
      success: false,
      data: {},
    };
    const allow = [this.authKey, this.adminKey].filter(s => s).includes(msg.key);

    if (allow) {
      client.isAuthorized = true;
      response.success = true;
      response.data.isAuthorized = true;

      if (msg.info) {
        await this.manager.broadcast(
          new MergeClientInfoEvent({ id: client.id, ext: { info: msg.info } })
        );
      }
    }

    if (msg.key === this.adminKey) {
      client.isAdmin = true;
      response.data.isAdmin = true;
    }

    client.sendMessage(response, evt.evtId);
  }
}
