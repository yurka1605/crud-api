import { Server } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { ErrorsEnum, IUser, ResponseCodes } from '../models';
import request from 'supertest';
import App from '../app';
import { mockData, serverSettings } from './mocks';
import { serverErrorMessage } from '../constants';

describe('Checking return errors:', () => {
  let server: Server;
  let invalidUserData: Pick<IUser, 'age' | 'hobbies'>;
  let invalidId: string = 'invalidId';
  let uuidId: string;

  beforeAll(() => {
    invalidUserData = <Pick<IUser, 'age' | 'hobbies'>>mockData.invalidUserData;
    uuidId = uuidv4();
    const { state, port } = serverSettings;
    server = new App(state, port).server;
  });

  it('should return error - Api method not found', async () => {
    const res = await request(server).get('/api/feature/not/found');
    expect(res.statusCode).toBe(ResponseCodes.NOT_FOUND);
  });

  it('should get error invalid input data', async () => {
    const res = await request(server).post('/api/users').send(invalidUserData);
    expect(res.statusCode).toBe(ResponseCodes.BAD_REQUEST);
    expect(res.text).toBe(ErrorsEnum.REQUIRED_PARAMS_MISSING);
  });

  it('should get error invalid input data types', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({
        username: {},
        ...invalidUserData,
      });
    expect(res.statusCode).toBe(ResponseCodes.BAD_REQUEST);
    expect(res.text).toEqual(ErrorsEnum.INVALID_DATA_TYPES);
  });

  it('should get internal server error', async () => {
    const res = await request(server).post('/api/users').send('');
    expect(res.statusCode).toBe(ResponseCodes.SERVER_ERROR);
    expect(res.text).toEqual(serverErrorMessage);
  });

  it('should get error - invalid id format', async () => {
    const res = await request(server).put(`/api/users/${invalidId}`).send({});

    expect(res.statusCode).toBe(ResponseCodes.BAD_REQUEST);
    expect(res.text).toEqual(ErrorsEnum.INVALID_ID);
  });

  it(`should get error - User doesn't exist`, async () => {
    const res = await request(server).delete(`/api/users/${uuidId}`);

    expect(res.statusCode).toBe(ResponseCodes.NOT_FOUND);
    expect(res.body).toEqual({});
  });
});
