export interface IClientInfo<T = any> {
  id: string;
  info?: Partial<T>;
  data?: Partial<T>;
}

export interface IRoomInfo<T = any> {
  id: string;
  info?: Partial<T>;
  data?: Partial<T>;
  clients?: IClientInfo[];
}

export type ClassType = new (...args: any) => any;
