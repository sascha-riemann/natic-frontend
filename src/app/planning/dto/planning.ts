import { ResourceDto } from '../../resources/dto/resource.dto';

export type Planning = {
  id: number;
  date: Date;
  project: {
    id: number;
    name: string;
    created: Date;
  };
  users: {
    id: number;
    firstName: string;
    lastName: string;
  }[];
  resources: ResourceDto[];
  created: Date;
};
