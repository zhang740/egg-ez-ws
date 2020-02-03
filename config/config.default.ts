import * as path from 'path';
import { Application } from 'egg';

export default (app: Application) => {
  return {
    ws: {
      authKey: 'egg-ez-ws!',
      adminKey: 'egg-ez-ws-admin@',
    },
    customLogger: {
      ClusterManager: {
        file: path.join(app.baseDir, `logs/${app.name}/bizlogger/ezws-cluster-manager.log`),
      },
      ClientManager: {
        file: path.join(app.baseDir, `logs/${app.name}/bizlogger/ezws-client-manager.log`),
      },
    },
  };
};
