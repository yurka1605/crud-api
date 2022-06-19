import cluster from 'cluster';
import os from 'os';
import { log } from './helpers';
import { IState } from 'models/state';
import App from './app';

export class ClusterApp {
  state: IState;
  workers: Array<import('cluster').Worker> = [];

  constructor(state: IState) {
    this.state = state;
    cluster.isPrimary ? this.runPrimary() : this.runChild();
  }

  private runPrimary() {
    log(`Primary ${process.pid} is running`);
    for (let i = 0; i < os.cpus().length; i++) {
      const newWorker = cluster.fork();
      newWorker.send(this.state);
      this.workers.push(newWorker);
    }

    cluster.on('message', (worker, state) => {
      this.sendMessageToWorkers(state, worker.id);
    });
  }

  private runChild() {
    let app: App;
    process.on('message', (state: IState) => {
      if (!app) {
        app = new App(state);
        app.runServer();
      } else {
        app.state = state;
      }
    });
    log(`Worker ${process.pid} started`);
  }

  private sendMessageToWorkers(state: IState, workerId: number) {
    this.state = state;
    this.workers.forEach((worker) => {
      if (workerId !== worker.id) {
        worker.send(this.state);
      }
    });
  }
}
