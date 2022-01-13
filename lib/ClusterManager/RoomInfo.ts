import * as uuid from 'uuid';
import { IRoomInfo } from '../contract';

export class RoomInfo {
  readonly id: string;
  ext = {
    /** 对外信息 */
    info: {},
    /** 服务端数据 */
    data: {},
    /** 创建时间 */
    gmtCreated: Date.now(),
  };

  constructor(info: IRoomInfo, readonly clientIds: string[] = []) {
    this.id = info.id || uuid.v4();
    this.ext.info = info.info || {};
    this.ext.data = info.data || {};
    this.ext.gmtCreated = info.gmtCreated || Date.now();
  }
}
