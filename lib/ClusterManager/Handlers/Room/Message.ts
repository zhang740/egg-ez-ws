import { BaseEventHandler } from '../BaseEventHandler';
import { RoomMessageEvent } from '../../../contract/W_A';
import { ClientMessageEvent } from '../../../contract/Any';

export class RoomMessageHandler extends BaseEventHandler<RoomMessageEvent> {
  eventType = RoomMessageEvent;

  async processor(evt: RoomMessageEvent) {
    const room = await this.manager.getRoom(evt.data.roomId);
    if (!room) {
      return;
    }
    room.clientIds.forEach(cid => {
      // 不发送给自己
      if (cid === evt.data.fromId) {
        return;
      }
      this.manager.eventProcess(
        new ClientMessageEvent({
          fromId: evt.data.fromId,
          clientId: cid,
          msg: evt.data.msg,
        })
      );
    });
    return this.genNoopEvent(evt);
  }
}
