export interface IClientInfo<T = any> {
  id: string;
  info?: Partial<T>;
  data?: Partial<T>;
  roomIds?: DeepReadonly<string[]>;
  gmtCreated?: number;
}

export interface IRoomInfo<T = any> {
  id: string;
  info?: Partial<T>;
  data?: Partial<T>;
  clients?: IClientInfo[];
  gmtCreated?: number;
}

export type ClassType = new (...args: any) => any;

export type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
