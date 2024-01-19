import { Resource } from '../../resources/dto/resource.dto';
import { ResourceCategory } from '../../resources/dto/resource-category.dto';

export interface BusinessResourcesDTO {
  category: ResourceCategory;
  resources: Resource[];
}
