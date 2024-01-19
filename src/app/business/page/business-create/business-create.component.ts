import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';

import { BusinessEndpoints } from '../../business.module';
import { BusinessCreateDto } from '../../dto/business-create';
import { BusinessUtils } from '../../utils/business-utils';

@Component({
  selector: 'app-business-create',
  templateUrl: './business-create.component.html',
  styleUrls: ['./business-create.component.scss'],
})
export class BusinessCreateComponent {
  formGroup = new FormGroup({
    name: new FormControl(undefined, Validators.required),
    description: new FormControl(undefined, Validators.required),
    address: new FormControl(undefined, Validators.required),
  });

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  submit(): void {
    this.http
      .post<number>(BusinessEndpoints.create, {
        name: this.formGroup.get('name')!.value!,
        description: this.formGroup.get('description')!.value!,
        address: this.formGroup.get('address')!.value!,
      } as BusinessCreateDto)
      .pipe(take(1))
      .subscribe((result: number) => {
        BusinessUtils.SET_ID(result);
        void this.router.navigateByUrl('/');
      });
  }
}
