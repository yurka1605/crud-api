import 'dotenv/config';
import { createServer, RequestListener, Server } from 'http';
import Router from './router';
import { ErrorsEnum, ResponseCodes, RequestTypeEnum } from './models';
import { debug, parseUrl, error as printError, log, logData } from './helpers';
import { defaultHost, defaultPort } from './constants';

class App {
	PORT: number;
	HOST: string;
	server: Server;
	router: Router;

	constructor(port?: number, host?: string) {
		this.PORT = port || defaultPort;
		this.HOST = host || defaultHost;
		this.server = createServer(this.listener);
		this.router = new Router();
	}

	public runServer() {
		this.server.listen(this.PORT, this.HOST, () => debug(`Server running on port ${this.PORT}`));
	}

	private listener: RequestListener = async (req, res) => {
		try {
			req.url = parseUrl(<string>req.url);

			const resMethod = <RequestTypeEnum>req.method;
			const config = this.router.getCurrentRouteConfig(req.url);
			const action = config?.methods[resMethod];

			if (action) {
				await action(req, res);
				logData(<string>req.method, req.url, res.statusCode, res.statusMessage);
			} else {
				res.writeHead(ResponseCodes.NOT_FOUND, ErrorsEnum.API);
				res.end(ErrorsEnum.API);
			}
		} catch (error: any) {
			printError(ErrorsEnum.SERVER);
			log(error);
			res.writeHead(ResponseCodes.SERVER_ERROR, error?.message);
			res.end(ErrorsEnum.SERVER);
		}
	};
}

const app = new App(+(<string>process.env.PORT), process.env.HOST);
app.runServer();
