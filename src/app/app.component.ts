import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { map } from 'rxjs';

import { AuthenticationService } from './authentication/service/authentication.service';
import { BusinessUtils } from './business/utils/business-utils';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly items = [
    {
      label: 'Projekte',
      icon: 'pi pi-building',
      items: [
        {
          label: 'Erstellen',
          routerLink: 'project/create',
          icon: 'pi pi-plus',
        },
        {
          label: 'Alle anzeigen',
          routerLink: 'project',
          icon: 'pi pi-list',
        },
      ],
    },
    {
      label: 'Betrieb',
      icon: 'pi pi-shield',
      items: [
        {
          label: 'Benutzer',
          routerLink: './business/users',
          icon: 'pi pi-user',
        },
        {
          label: 'Planung',
          routerLink: 'planning',
          icon: 'pi pi-table',
        },
        {
          label: 'Ressourcen',
          routerLink: './business/resources',
          icon: 'pi pi-box',
        },
        {
          label: 'Rollen',
          routerLink: './roles',
          icon: 'pi pi-tag',
        },
      ],
    },
    {
      label: 'Arbeitszeiten',
      icon: 'pi pi-clock',
      routerLink: 'timesheet',
    },
  ];

  readonly userMenuItems: MenuItem[] = [
    {
      label: 'Einstellungen',
      icon: 'pi pi-cog',
      routerLink: '/settings',
    },
    {
      label: 'Betrieb auswählen',
      icon: 'pi pi-building',
      routerLink: '/business/select',
    },
    {
      label: 'Ausloggen',
      icon: 'pi pi-sign-out',
      routerLink: '/authentication/logout',
    },
  ];

  readonly showNavBar$ = this.authService.isAuthenticated$().pipe(map(authenticated => authenticated && !!BusinessUtils.GET_ID()));

  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router,
    private readonly themeService: ThemeService,
  ) {}

  changeTheme(theme: string): void {
    this.themeService.switchTheme(theme);
  }
}
