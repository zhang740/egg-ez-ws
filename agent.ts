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
  RoomMessageHandler,
} from './lib/ClusterManager/Handlers/Room';
import {
  ClientConnectHandler,
  ClientDisconnectHandler,
  ClientMessageHandler,
  ClientMergeInfoHandler,
  ClientInfoHandler,
  NoClientHandler,
} from './lib/ClusterManager/Handlers/Client';
import { IDataSyncService, LocalDataSyncService } from './lib/DataSync';

export default (agent: Agent) => {
  // FIXME egg 没有 agent 扩展
  const ioc = ((agent as any).iocContext = new IocContext());

  agent.logger.info('[egg-ez-ws] agent init...');
  const clusterManager = getInstance(ClusterManager, agent, undefined);

  // 注册默认数据同步服务
  ioc.register(LocalDataSyncService, IDataSyncService);

  // 注册默认事件处理器
  clusterManager.registerEventHandler(RoomJoinHandler);
  clusterManager.registerEventHandler(RoomExitHandler);
  clusterManager.registerEventHandler(RoomInfoHandler);
  clusterManager.registerEventHandler(RoomListHandler);
  clusterManager.registerEventHandler(RoomMessageHandler);
  clusterManager.registerEventHandler(ClientConnectHandler);
  clusterManager.registerEventHandler(ClientDisconnectHandler);
  clusterManager.registerEventHandler(NoClientHandler);
  clusterManager.registerEventHandler(ClientInfoHandler);
  clusterManager.registerEventHandler(ClientMessageHandler);
  clusterManager.registerEventHandler(ClientMergeInfoHandler);

  clusterManager.onSendTo.addHandler(evt => {
    agent.logger.debug('[egg-ez-ws] agent onSendTo', evt.type, evt.id, evt.pid);
    if (evt.pid) {
      agent.messenger.sendTo(evt.pid, MESSAGE_EVENT, evt);
    } else {
      agent.messenger.sendToApp(MESSAGE_EVENT, evt);
    }
  });

  agent.messenger.on(MESSAGE_EVENT, evt => {
    agent.logger.debug('[egg-ez-ws] agent on MESSAGE_EVENT', evt.type, evt.id, evt.pid);
    clusterManager.eventProcess(evt);
  });

  agent.logger.info('[egg-ez-ws] agent init ok');
};
