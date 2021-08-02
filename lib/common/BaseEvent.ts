import * as uuid from 'uuid';

export abstract class BaseEvent<T = {}> {
  get type() {
    return this.constructor.name;
  }
  readonly id = uuid.v4();
  readonly timestamp = Date.now();

  constructor(public readonly data: T, public readonly sourceId?: string, public pid?: number) {}

  toJSON() {
    return {
      ...this,
      type: this.type,
    };
  }
}
