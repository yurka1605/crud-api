import { IRouteConfig } from './models';
import { urlIdentifier } from './constants';

export default class Router {
  public _routes: Array<IRouteConfig> = [];

  constructor(initialRoutes: Array<IRouteConfig>) {
    this._routes = initialRoutes;
  }

  public getCurrentRouteConfig(url: string): IRouteConfig | null {
    return this._routes.find((route) => this.isUrlsMatch(url, route.name)) ?? null;
  }

  private isUrlsMatch(url: string, routeUrl: string): boolean {
    const urlParts = url.split('/');
    const routeUrlParts = routeUrl.split('/');

    if (urlParts.length !== routeUrlParts.length) {
      return false;
    }

    for (let index = 0; index < urlParts.length; index++) {
      const partOfRouteUrl = routeUrlParts[index];
      const partOfUrl = urlParts[index];

      if (partOfUrl !== partOfRouteUrl && partOfRouteUrl !== urlIdentifier) {
        return false;
      }
    }

    return true;
  }
}
