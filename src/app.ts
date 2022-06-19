import 'dotenv/config';
import { createServer, RequestListener, Server } from 'http';
import Router from './router';
import { ErrorsEnum, ResponseCodes, RequestTypeEnum } from './models';
import { debug, parseUrl, error as printError, log, logData } from './helpers';
import { defaultHost, defaultPort, serverErrorMessage } from './constants';
import { IState } from './models';
import { initUserRoutes } from './routes';

export default class App {
  PORT: number;
  HOST: string;
  server: Server;
  router: Router;
  state: IState;

  constructor(state: IState, port?: number, host?: string) {
    this.PORT = port || Number(process.env.PORT) || defaultPort;
    this.HOST = host || process.env.HOST || defaultHost;
    this.state = state;
    this.server = createServer(this.listener);
    this.router = new Router(initUserRoutes(this.state.users));
  }

  public runServer() {
    this.server.listen(this.PORT, this.HOST, () => debug(`Server running on port ${this.PORT}`));
  }

  private listener: RequestListener = async (req, res) => {
    try {
      debug(`Worker pid is ${process.pid.toString()}`);
      req.url = parseUrl(<string>req.url);

      const resMethod = <RequestTypeEnum>req.method;
      const config = this.router.getCurrentRouteConfig(req.url);
      const action = config?.methods[resMethod];

      if (action) {
        await action(req, res);
        logData(<string>req.method, req.url, res.statusCode, res.statusMessage);
        if (process.send) {
          process.send(this.state);
        }
      } else {
        res.writeHead(ResponseCodes.NOT_FOUND, ErrorsEnum.API);
        res.end(ErrorsEnum.API);
      }
    } catch (error: any) {
      printError(ErrorsEnum.SERVER);
      log(error);
      res.writeHead(ResponseCodes.SERVER_ERROR, ErrorsEnum.SERVER);
      res.end(serverErrorMessage);
    }
  };
}
