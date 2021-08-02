import * as uuid from 'uuid';
import { IClientInfo } from '../contract';

export class ClientInfo {
  readonly id: string;
  ext = {
    /** 对外信息 */
    info: {},
    /** 服务端数据 */
    data: {},
    /** 创建时间 */
    gmtCreated: Date.now(),
  };
  constructor(
    info: IClientInfo,
    readonly nodeId: string,
    readonly pid: number,
    readonly roomIds: string[] = []
  ) {
    this.id = info.id || uuid.v4();
    this.ext.info = info.info || {};
    this.ext.data = info.data || {};
    this.ext.gmtCreated = info.gmtCreated || Date.now();
  }
}
