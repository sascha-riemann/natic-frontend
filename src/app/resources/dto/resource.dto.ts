import { ResourceCategory } from './resource-category.dto';

export interface Resource {
  id: number;
  name: string;
  identification: string;
  category: ResourceCategory;
}

export interface ResourceDto {
  category: ResourceCategory;
  resources: Resource[];
}
