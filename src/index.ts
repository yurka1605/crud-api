import os from 'os';
import cluster from 'cluster';
import { clusterFlag } from './constants';
import App from './app';
import { log } from './helpers';
import state from './state';
import { IState } from './models';

if (process.argv.includes(clusterFlag)) {
  initClusters(os.cpus().length);
} else {
  new App(state).runServer();
}

function initClusters(numCPUs: number) {
  if (cluster.isPrimary) {
    log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork().send(state);
    }

    cluster.on('exit', (worker) => log(`worker ${worker.process.pid} died`));
  } else {
    process.once('message', (initialState: IState) => new App(initialState).runServer());
    log(`Worker ${process.pid} started`);
  }
}
