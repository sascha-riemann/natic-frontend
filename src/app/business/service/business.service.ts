import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BusinessEndpoints } from '../business.module';
import { BusinessResourcesDTO } from '../dto/business-resources-overview';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  constructor(private readonly http: HttpClient) {}

  getBusinessResourceOverview(): Observable<BusinessResourcesDTO[]> {
    return this.http.get<BusinessResourcesDTO[]>(BusinessEndpoints.resources);
  }
}
