export interface ResourceUpdateDto {
  id: number;
  name: string;
  identification: string;
  categoryId: number;
}

export type ResourceCreateDto = Omit<ResourceUpdateDto, 'id'>;
