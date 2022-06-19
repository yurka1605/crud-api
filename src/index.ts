import os from 'os';
import cluster from 'cluster';
import { clusterFlag } from './constants';
import App from './app';
import { log } from './helpers';
import { IState } from './models';
import { ClusterApp } from './cluster';

const state: IState = {
  users: [],
};

if (process.argv.includes(clusterFlag)) {
  new ClusterApp(state);
} else {
  new App(state).runServer();
}
