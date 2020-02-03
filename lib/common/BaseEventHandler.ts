import { BaseEvent } from './BaseEvent';
import { BaseManager } from './BaseManager';

export abstract class BaseEventHandler<
  T extends BaseEvent = BaseEvent,
  MT extends BaseManager = BaseManager
> {
  abstract readonly eventType: any;

  constructor(protected manager: MT) {}

  abstract processor(evt: T): Promise<BaseEvent | void>;
}
