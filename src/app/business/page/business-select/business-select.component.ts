import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListboxClickEvent } from 'primeng/listbox/listbox.interface';

import { BusinessEndpoints } from '../../business.module';
import { BusinessSelectDto } from '../../dto/business-select.dto';
import { BusinessUtils } from '../../utils/business-utils';

@Component({
  selector: 'app-business-select',
  templateUrl: './business-select.component.html',
  styleUrls: ['./business-select.component.scss'],
})
export class BusinessSelectComponent {
  options$ = this.http.get<BusinessSelectDto[]>(BusinessEndpoints.get);

  constructor(private readonly router: Router, private readonly http: HttpClient) {}

  selectOrganisation(event: ListboxClickEvent): void {
    const business = event.option as BusinessSelectDto;
    BusinessUtils.SET_ID(business.id);
    void this.router.navigateByUrl('/');
  }
}
