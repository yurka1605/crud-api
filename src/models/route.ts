import { IncomingMessage, ServerResponse } from 'http';
import { RequestTypeEnum } from '../models';

export interface IRouteConfig {
  name: string;
  methods: RouteMethodType;
}

type RouteMethodType = {
  [key in RequestTypeEnum]?: (req: IncomingMessage, res: ServerResponse) => Promise<void> | void;
};