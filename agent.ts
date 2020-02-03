import { IocContext } from 'power-di';
import { Agent } from 'egg';
import { getInstance } from 'egg-aop';
import { ClusterManager } from './lib';
import { MESSAGE_EVENT } from './lib/contract';
import {
  RoomJoinHandler,
  RoomExitHandler,
  RoomInfoHandler,
  RoomListHandler,
} from './lib/ClusterManager/Handlers/Room';
import {
  ClientConnectHandler,
  ClientDisconnectHandler,
  ClientMessageHandler,
  ClientMergeInfoHandler,
} from './lib/ClusterManager/Handlers/Client';

export default (agent: Agent) => {
  // FIXME egg 没有 agent 扩展
  (agent as any).iocContext = new IocContext();

  agent.beforeStart(() => {
    const clusterManager = getInstance(ClusterManager, agent, undefined);

    // 注册默认事件处理器
    clusterManager.registerEventHandler(RoomJoinHandler);
    clusterManager.registerEventHandler(RoomExitHandler);
    clusterManager.registerEventHandler(RoomInfoHandler);
    clusterManager.registerEventHandler(RoomListHandler);
    clusterManager.registerEventHandler(ClientConnectHandler);
    clusterManager.registerEventHandler(ClientDisconnectHandler);
    clusterManager.registerEventHandler(ClientMessageHandler);
    clusterManager.registerEventHandler(ClientMergeInfoHandler);

    clusterManager.onSendTo.addHandler(evt => {
      agent.messenger.sendToApp(MESSAGE_EVENT, evt);
    });

    agent.messenger.on(MESSAGE_EVENT, evt => {
      clusterManager.eventProcess(evt);
    });
  });
};
