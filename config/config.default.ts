import * as path from 'path';

export default (app: any) => {
  return {
    ws: {
      authKey: 'egg-ez-ws!',
      adminKey: 'egg-ez-ws-admin@',
    },
    customLogger: {
      BaseManager: {
        file: path.join(app.root, `logs/ez-ws/base-manager.log`),
      },
      ClusterManager: {
        file: path.join(app.root, `logs/ez-ws/cluster-manager.log`),
      },
      ClientManager: {
        file: path.join(app.root, `logs/ez-ws/client-manager.log`),
      },
    },
  };
};
