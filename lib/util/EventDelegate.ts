type EventHandler<T> = (event: T) => void;

export class EventDelegate<T> {
  private handler: EventHandler<T>[] = [];

  emit(event: T) {
    this.handler.forEach(h => h(event));
  }

  addHandler(handler: EventHandler<T>) {
    this.handler.push(handler);
    return this;
  }
}
