import { User } from '../../user/dto/user';

export interface Role {
  id: number;
  name: string;
  businessPermissions: BusinessPermissions;
  projectPermissions: ProjectPermissions;
  users: User[];
}

export interface UpdateRole extends Omit<Role, 'users'> {
  userIds: number[];
}

export class BusinessPermissions {
  createProjects = false;
}

export class ProjectPermissions {
  updateInformation = false;
}

export type RoleCreate = Omit<UpdateRole, 'id'>;
