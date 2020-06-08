import { EggApplication } from 'egg';
import { BaseEventHandler } from './BaseEventHandler';
import { BaseEvent } from './BaseEvent';
import { EventDelegate } from '../util/EventDelegate';
import { ClassType } from '../contract';

const CALLBACK_TIMEOUT_MS = 5 * 1000;

type CallbackFunction = (evt: BaseEvent) => void;

export abstract class BaseManager<T extends EggApplication = EggApplication> {
  protected logger = this.app.getLogger('BaseManager');
  readonly onSendTo = new EventDelegate<BaseEvent>();
  protected eventHandlers = new Map<string, BaseEventHandler>();
  private type = this.constructor.name;
  private cbHandlers = new Map<string, CallbackFunction>();

  constructor(protected app: T) {}

  async broadcast<T extends ClassType>(
    evt: BaseEvent,
    cbType?: T
  ): Promise<InstanceType<T> | void> {
    this.logger.info(`[${this.type}] broadcast evt: ${evt.type} cbType: ${cbType?.name}.`);
    this.onSendTo.emit(evt);
    if (cbType) {
      return new Promise(r => {
        const timeout = setTimeout(() => {
          this.logger.warn(
            `[${this.type}] callback event is timeout! evt: ${evt.type} cbType: ${cbType.name}.`
          );
          this.cbHandlers.delete(evt.id);
          r();
        }, CALLBACK_TIMEOUT_MS);
        this.cbHandlers.set(evt.id, cbEvt => {
          this.cbHandlers.delete(evt.id);
          if (cbEvt.type !== cbType.name) {
            this.logger.error(
              `[${this.type}] callback event type is correct! e: ${cbType.name} a: ${cbEvt.type}.`
            );
            r();
          } else {
            r(cbEvt as any);
          }
          clearTimeout(timeout);
        });
      });
    }
  }

  /** 事件处理 */
  async eventProcess(evt: BaseEvent) {
    this.logger.debug(`[${this.type}] eventProcess`, evt);
    try {
      // callback 优先
      if (evt.sourceId) {
        const handler = this.cbHandlers.get(evt.sourceId);
        if (handler) {
          handler(evt);
          return;
        }
      }

      // 非 callback 则正常流程处理
      const type = evt.type;
      const handler = this.eventHandlers.get(type);
      if (handler) {
        const newEvt = await handler.processor(evt);
        if (newEvt) {
          this.onSendTo.emit(newEvt);
        }
      } else {
        this.logger.error(`[${this.type}] eventProcess Not found Event: [${type}] handler!`, evt);
      }
    } catch (error) {
      this.logger.error(`[${this.type}] eventProcess Err!`, error, evt);
    }
  }
}
