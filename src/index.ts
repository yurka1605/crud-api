import { cpus } from 'os';
import cluster from 'cluster';
import { clusterFlag } from './constants';
import App from './app';
import { log } from './helpers';

const app = new App();
if (process.argv.includes(clusterFlag)) {
  const numCPUs = cpus().length;
  if (cluster.isPrimary) {
    log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      log(`worker ${worker.process.pid} died`);
    });
  } else {
    app.runServer();
    log(`Worker ${process.pid} started`);
  }
} else {
  app.runServer();
}
