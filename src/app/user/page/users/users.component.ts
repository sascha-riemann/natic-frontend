import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { startWith, Subject, switchMap, take } from 'rxjs';

import { DialogUserFormComponent } from '../../dialog/dialog-user-form/dialog-user-form.component';
import { User } from '../../dto/user';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-business-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private readonly reload$ = new Subject<void>();

  readonly businessUsers$ = this.reload$.pipe(
    startWith(null),
    switchMap(() => this.userService.getUsers()),
  );

  constructor(private readonly dialog: DialogService, private readonly userService: UserService) {}

  openUser(user?: User): void {
    this.dialog
      .open(DialogUserFormComponent, {
        header: `Benutzer ${user ? 'bearbeiten' : 'erstellen'}`,
        styleClass: 'dialog',
        ...(user ? { data: user } : {}),
      })
      .onClose.pipe(take(1))
      .subscribe((result?: boolean) => {
        if (result) {
          this.reload$.next();
        }
      });
  }

  removeUserFromBusiness(user: User): void {
    this.userService
      .removeUserFromBusiness(user.id)
      .pipe(take(1))
      .subscribe(() => this.reload$.next());
  }
}
