import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, of, startWith, Subject, switchMap, take } from 'rxjs';

import { BusinessEndpoints } from '../../business.module';
import { UserOverviewDto } from '../../dto/user-overview.dto';
import { BusinessUtils } from '../../utils/business-utils';

@Component({
  selector: 'app-business-staff',
  templateUrl: './business-users.component.html',
  styleUrls: ['./business-users.component.scss'],
})
export class BusinessUsersComponent {
  refresh$ = new Subject<void>();

  users$ = this.refresh$.pipe(
    startWith(null),
    switchMap(() => of(BusinessUtils.GET_ID())),
    filter(businessId => !!businessId),
    map(businessId => businessId as number),
    switchMap((businessId: number) => this.http.get<UserOverviewDto[]>(BusinessEndpoints.USERS(businessId))),
  );

  createUser = new FormGroup({
    firstName: new FormControl(undefined, Validators.required),
    lastName: new FormControl(undefined, Validators.required),
    username: new FormControl(undefined, Validators.required),
    email: new FormControl(undefined, Validators.required),
    phone: new FormControl(undefined, Validators.required),
  });

  constructor(private readonly http: HttpClient, private readonly route: ActivatedRoute, private readonly router: Router) {}

  createAndInviteStaff(): void {
    if (!BusinessUtils.GET_ID()) {
      return;
    }

    this.http
      .post(BusinessEndpoints.USERS(BusinessUtils.GET_ID()!), this.createUser.value)
      .pipe(take(1))
      .subscribe(() => {
        // this.resetUserCreation();
        this.refresh$.next();
      });
  }

  resetUserCreation(): void {
    this.createUser.reset();
  }
}
