import { BaseEvent, BaseEventHandler as BEH } from '../../common';
import { ClusterManager } from '..';

export abstract class BaseEventHandler<T extends BaseEvent = BaseEvent> extends BEH<
  T,
  ClusterManager
> {}
