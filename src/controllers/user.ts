import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { IUser, ResponseCodes, ContentTypes } from '../models';
import {
  parseBody,
  setResponseInvalidDataType,
  setResponseInvalidUserId,
  setResponseMissingRequireData,
  setResponseUserNotExist
} from '../helpers';

export class User {
  private _users: Array<IUser>;

  constructor(users: Array<IUser>) {
    this._users = users;
  }

  public async create(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const { username, age, hobbies }: Omit<IUser, 'id'> = JSON.parse(await parseBody(req));

    if (!username || !age || !hobbies) {
      setResponseMissingRequireData(res);
      return;
    }

    if (!this.isDataTypesValid(username, age, hobbies)) {
      setResponseInvalidDataType(res);
      return;
    }

    const newUser: IUser = {
      id: uuidv4(),
      username,
      age,
      hobbies
    };
    this._users.push(newUser);

    res.writeHead(ResponseCodes.CREATED, { 'Content-type': ContentTypes.JSON });
    res.end(JSON.stringify(newUser));
  }

  public get(req: IncomingMessage, res: ServerResponse): void {
    const userId = this.getUserIdFromUrl(<string>req.url);

    if (!isUuid(userId)) {
      setResponseInvalidUserId(res);
      return;
    }

    const user = this.getUserById(userId);
    if (!user) {
      setResponseUserNotExist(res);
      return;
    }

    res.writeHead(ResponseCodes.OK, { 'Content-type': ContentTypes.JSON });
    res.end(JSON.stringify(user));
  }

  public getAll(_: IncomingMessage, res: ServerResponse): void {
    res.writeHead(ResponseCodes.OK, { 'Content-type': ContentTypes.JSON });
    res.end(JSON.stringify(this._users));
  }

  public async update(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const userId = this.getUserIdFromUrl(<string>req.url);
    const { username, age, hobbies }: Omit<IUser, 'id'> = JSON.parse(await parseBody(req));

    if (!isUuid(userId)) {
      setResponseInvalidUserId(res);
      return;
    }

    if (!username || !age || !hobbies) {
      setResponseMissingRequireData(res);
      return;
    }

    if (!this.isDataTypesValid(username, age, hobbies)) {
      setResponseInvalidDataType(res);
      return;
    }

    const user = this.getUserById(userId);
    if (!user) {
      setResponseUserNotExist(res);
      return;
    }

    user.age = age;
    user.hobbies = hobbies;
    user.username = username;

    res.writeHead(ResponseCodes.OK).end();
  }

  public async patch(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const userId = this.getUserIdFromUrl(<string>req.url);
    const { username, age, hobbies }: Omit<IUser, 'id'> = JSON.parse(await parseBody(req));

    if (!isUuid(userId)) {
      setResponseInvalidUserId(res);
      return;
    }

    if (!(username || age || hobbies)) {
      res.writeHead(ResponseCodes.BAD_REQUEST);
      res.end('No request data');
      return;
    }

    if (!this.isDataTypesValid(username, age, hobbies)) {
      setResponseInvalidDataType(res);
      return;
    }

    const user = this.getUserById(userId);
    if (!user) {
      setResponseUserNotExist(res);
      return;
    }

    user.age = age ?? user.age;
    user.hobbies = hobbies ?? user.hobbies;
    user.username = username ?? user.username;

    res.writeHead(ResponseCodes.OK).end();
  }

  public delete(req: IncomingMessage, res: ServerResponse) {
    const userId = this.getUserIdFromUrl(<string>req.url);

    if (!isUuid(userId)) {
      setResponseInvalidUserId(res);
      return;
    }

    const deletedUser = this.getUserById(userId);
    if (!deletedUser) {
      setResponseUserNotExist(res);
      return;
    }

    this._users = this._users.filter(user => user.id !== deletedUser.id);
    res.writeHead(ResponseCodes.NO_CONTENT).end();
  }

  private getUserById(id: string) {
    return this._users.find((user) => user.id === id) || null;
  }

  private getUserIdFromUrl(url: string): string {
    return url.split('/')[2];
  }

  private isDataTypesValid(username: string, age: number, hobbies: Array<string>): boolean {
    if (username && typeof username !== 'string') {
      return false;
    }

    if (age && typeof age !== 'number') {
      return false;
    }

    if (hobbies && !Array.isArray(hobbies)) {
      return false;
    }

    return true;
  }
}
