import { BaseEvent, BaseEventHandler as BEH } from '../../common';
import { ClusterManager } from '..';
import { NoopEvent } from '../../contract/W_A';

export abstract class BaseEventHandler<T extends BaseEvent = BaseEvent> extends BEH<
  T,
  ClusterManager
> {
  protected genNoopEvent(evt: T) {
    return new NoopEvent(
      {
        evtType: evt.type,
      },
      evt.id,
      evt.pid
    );
  }
}
