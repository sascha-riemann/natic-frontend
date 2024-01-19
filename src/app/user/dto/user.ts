import { Role } from '../../role/model/role';

export interface User {
  id: number;
  username?: string;
  email: string;
  firstName: string;
  lastName: string;
  workTimePerDay?: number;
  role?: Role;
}

export type CreateUser = Omit<User, 'id'>;

export interface UpdateUser extends User {
  password?: string;
}
