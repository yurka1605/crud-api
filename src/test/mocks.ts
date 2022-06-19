import { IState } from 'models/state';
import { IUser } from './../models/user';
export const mockData = {
  user: {
    username: 'initTest',
    age: 18,
    hobbies: ['test'],
  },
  updatedUser: {
    username: 'updatedTestData',
    age: 42,
    hobbies: ['test', 'soccer'],
  },
  invalidUserData: {
    age: 18,
    hobbies: ['test'],
  },
} as {
  [key: string]: Omit<IUser, 'id'> | Pick<IUser, 'age' | 'hobbies'>;
};

export const serverSettings: { state: IState, port: number } = {
  state: { users: [] },
  port: 6000,
}
