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
      // 不发送给自己
      if (c.id === evt.data.fromId) {
        return;
      }
      this.manager.eventProcess(
        new ClientMessageEvent(
          {
            fromId: evt.data.fromId,
            clientId: c.id,
            msg: evt.data.msg,
          },
          evt.id
        )
      );
    });
  }
}
