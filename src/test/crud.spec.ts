import { Server } from 'http';
import { ContentTypes, IUser, ResponseCodes } from '../models';
import request from 'supertest';
import App from '../app';
import { mockData, serverSettings } from './mocks';

describe('Users CRUD API:', () => {
  let server: Server;
  let userData: Omit<IUser, 'id'>;
  let updatedUser: Omit<IUser, 'id'>;
  let userId: string;

  beforeAll(() => {
    userData = <Omit<IUser, 'id'>>mockData.user;
    updatedUser = <Omit<IUser, 'id'>>mockData.updatedUser;
    const { state, port } = serverSettings;
    server = new App(state, port).server;
  });

  it('should get all users', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(ResponseCodes.OK);
    expect(res.type).toBe(ContentTypes.JSON);
    expect(res.body).toEqual([]);
  });

  it('should create new user', async () => {
    const res = await request(server).post('/api/users').send(userData);
    userId = res.body.id;
    expect(res.statusCode).toBe(ResponseCodes.CREATED);
    expect(res.type).toBe(ContentTypes.JSON);
    expect(res.body).toEqual({
      id: userId,
      ...userData,
    });
  });

  it('should get created user', async () => {
    const res = await request(server).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(ResponseCodes.OK);
    expect(res.type).toBe(ContentTypes.JSON);
    expect(res.body).toEqual({
      id: userId,
      ...userData,
    });
  });

  it('should changed user data', async () => {
    const res = await request(server).put(`/api/users/${userId}`).send(updatedUser);

    expect(res.statusCode).toBe(ResponseCodes.OK);
    expect(res.type).toEqual(ContentTypes.JSON);
    expect(res.body).toEqual({
      id: userId,
      ...updatedUser,
    });
  });

  it('should delete user', async () => {
    const res = await request(server).delete(`/api/users/${userId}`);

    expect(res.statusCode).toBe(ResponseCodes.NO_CONTENT);
    expect(res.body).toEqual({});
  });

  it('should return user not found', async () => {
    const res = await request(server).get(`/api/users/${userId}`);

    expect(res.statusCode).toBe(ResponseCodes.NOT_FOUND);
    expect(res.body).toEqual({});
  });
});
