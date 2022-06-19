import { Server } from 'http';
import { ContentTypes, IUser, ResponseCodes } from '../models';
import request from 'supertest';
import App from '../app';
import { mockData, serverSettings } from './mocks';

describe('Api test 3:', () => {
  let server: Server;
  let userData: Omit<IUser, 'id'>;
  let updatedUser: Omit<IUser, 'id'>;
  let user1Id: string;
  let user2Id: string;

  beforeAll(() => {
    userData = <Omit<IUser, 'id'>>mockData.user;
    updatedUser = <Omit<IUser, 'id'>>mockData.updatedUser;
    const { state, port } = serverSettings;
    server = new App(state, port).server;
  });

  it('should create new user', async () => {
    const res = await request(server).post('/api/users').send(userData);
    user1Id = res.body.id;
    expect(res.statusCode).toBe(ResponseCodes.CREATED);
    expect(res.type).toBe(ContentTypes.JSON);
    expect(res.body).toEqual({
      id: user1Id,
      ...userData,
    });
  });

  it('should create second user', async () => {
    const res = await request(server).post('/api/users').send(userData);
    user2Id = res.body.id;
    expect(res.statusCode).toBe(ResponseCodes.CREATED);
    expect(res.type).toBe(ContentTypes.JSON);
    expect(res.body).toEqual({
      id: user2Id,
      ...userData,
    });
  });

  it('should get all users', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(ResponseCodes.OK);
    expect(res.type).toBe(ContentTypes.JSON);
    expect(res.body.length).toBe(2);
    expect(res.body).toEqual([
      {
        id: user1Id,
        ...userData,
      },
      {
        id: user2Id,
        ...userData,
      },
    ]);
  });

  it('should changed part of user data', async () => {
    const { age, hobbies } = updatedUser;
    const resByUser1 = await request(server).patch(`/api/users/${user1Id}`).send({ age, hobbies });
    const resByUser2 = await request(server).patch(`/api/users/${user1Id}`).send({ age });

    expect(resByUser1.statusCode === resByUser2.statusCode).toBeTruthy();
    expect(resByUser1.body.age === resByUser2.body.age).toBeTruthy();
    expect(resByUser1.body.hobbies === resByUser2.body.hobbies).toBeFalsy();
  });

  it('should delete users', async () => {
    const resByUser1 = await request(server).delete(`/api/users/${user1Id}`);
    const resByUser2 = await request(server).delete(`/api/users/${user2Id}`);

    expect(resByUser1.statusCode === resByUser2.statusCode).toBeTruthy();
  });

  it('should get all users', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(ResponseCodes.OK);
    expect(res.type).toBe(ContentTypes.JSON);
    expect(res.body.length === 0).toBeTruthy();
    expect(res.body).toEqual([]);
  });
});
