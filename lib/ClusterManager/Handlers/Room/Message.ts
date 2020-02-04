import { BaseEventHandler } from '../BaseEventHandler';
import { RoomMessageEvent } from '../../../contract/W_A';
import { ClientMessageEvent } from '../../../contract/Any';

export class RoomMessageHandler extends BaseEventHandler<RoomMessageEvent> {
  eventType = RoomMessageEvent;

  async processor(evt: RoomMessageEvent): Promise<void> {
    const room = await this.manager.getRoom(evt.data.roomId);
    if (!room) {
      return;
    }
    room.clients.forEach(c => {
      this.manager.eventProcess(
        new ClientMessageEvent({ clientId: c.id, msg: evt.data.msg }, evt.id)
      );
    });
  }
}
