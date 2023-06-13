import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { BusinessEndpoints } from '../business.module';
import { UserOverviewDto } from '../dto/user-overview.dto';
import { BusinessUtils } from '../utils/business-utils';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  constructor(private readonly http: HttpClient) {}

  getBusinessUsers() {
    const businessId = BusinessUtils.GET_ID();
    if (businessId) {
      return this.http.get<UserOverviewDto[]>(BusinessEndpoints.USERS(businessId));
    } else {
      return of([]);
    }
  }
}
