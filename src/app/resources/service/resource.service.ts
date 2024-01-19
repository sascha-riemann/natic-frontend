import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ResourceCategoryCreateDto } from '../dto/resource-category-create.dto';
import { ResourceCategoryUpdateDto } from '../dto/resource-category-update.dto';
import { ResourceCreateDto } from '../dto/resource-create.dto';
import { ResourceEndpoints } from '../resources.module';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  constructor(private readonly http: HttpClient) {}

  createResourceCategory(dto: ResourceCategoryCreateDto): Observable<number> {
    return this.http.post<number>(ResourceEndpoints.CATEGORY_CREATE, dto);
  }

  updateResourceCategory(dto: ResourceCategoryUpdateDto): Observable<number> {
    return this.http.post<number>(ResourceEndpoints.CATEGORY_UPDATE(dto.id), dto);
  }

  createResource(dto: ResourceCreateDto): Observable<number> {
    return this.http.post<number>(ResourceEndpoints.POST, dto);
  }

  updateResource(resourceId: number, dto: ResourceCreateDto): Observable<number> {
    return this.http.post<number>(ResourceEndpoints.UPDATE(resourceId), dto);
  }

  deleteResource(resourceId: number): Observable<void> {
    return this.http.delete<void>(ResourceEndpoints.DELETE(resourceId));
  }

  deleteResourceCategory(resourceCategoryId: number): Observable<void> {
    return this.http.delete<void>(ResourceEndpoints.CATEGORY_DELETE(resourceCategoryId));
  }
}
