import { Client } from '../Client';
import { Application } from 'egg';
import { ClientManager } from '..';

export abstract class BaseCommandProcessor {
  /** 事件匹配规则 */
  abstract readonly tester: string | ((type: string) => boolean);
  /** 是否需要鉴权 */
  readonly needAuth: boolean = true;
  /** 消息处理 */
  abstract onMessage(client: Client, msg: any): Promise<void>;

  constructor(protected app: Application, protected manager: ClientManager) {}
}
