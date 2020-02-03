import { Application } from 'egg';
import { getInstance } from 'egg-aop';
import { ClientManager } from './lib';
import { Server } from 'ws';
import { MESSAGE_EVENT } from './lib/contract';
import { AuthCommandProcessor } from './lib/ClientManager/Command/AuthCommand';
import { MessageCommandProcessor } from './lib/ClientManager/Command/MessageCommand';
import { DebugCommandProcessor } from './lib/ClientManager/Command/DebugCommand';
import { ClientMessageHandler } from './lib/ClientManager/Handlers/ClientMessage';
import {
  RoomJoinCommandProcessor,
  RoomExitCommandProcessor,
} from './lib/ClientManager/Command/RoomCommand';

export default (app: Application) => {
  app.on('server', server => {
    const clientManager = getInstance(ClientManager, app, undefined);

    // 注册默认事件处理器
    clientManager.registerEventHandler(ClientMessageHandler);

    // 注册默认命令处理器
    clientManager.registerCommandProcessor(AuthCommandProcessor);
    clientManager.registerCommandProcessor(DebugCommandProcessor);
    clientManager.registerCommandProcessor(MessageCommandProcessor);
    clientManager.registerCommandProcessor(RoomJoinCommandProcessor);
    clientManager.registerCommandProcessor(RoomExitCommandProcessor);

    clientManager.onSendTo.addHandler(evt => {
      app.messenger.sendToAgent(MESSAGE_EVENT, evt);
    });

    app.messenger.on(MESSAGE_EVENT, evt => {
      clientManager.eventProcess(evt);
    });

    const wss = new Server({ server: server });
    wss.on('connection', function(ws) {
      clientManager.createClient(ws);
    });
  });
};