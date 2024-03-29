import { BaseEvent, BaseEventHandler as BEH } from '../../common';
import { ClientManager } from '..';

export abstract class BaseEventHandler<T extends BaseEvent = BaseEvent> extends BEH<
  T,
  ClientManager
> {}
