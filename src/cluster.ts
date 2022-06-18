import cluster from 'cluster';
import { log } from './helpers';
import { cpus } from 'os';

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    log(`worker ${worker.process.pid} died`);
  });
} else {
  log(`Worker ${process.pid} started`);
}
