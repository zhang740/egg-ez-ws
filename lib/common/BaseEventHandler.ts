import { BaseEvent } from './BaseEvent';
import { BaseManager } from './BaseManager';

export abstract class BaseEventHandler<
  T extends BaseEvent = BaseEvent,
  MT extends BaseManager = BaseManager
> {
  abstract readonly eventType: any;

  constructor(protected manager: MT) {}

  abstract processor(evt: T): Promise<BaseEvent | void>;

  log(type: Parameters<MT['log']>[0], ...args: any[]) {
    this.manager.log(type, this.constructor.name, ...args);
  }
}
