import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  items = [
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
        // {
        //   label: 'Rollen',
        //   icon: 'pi pi-tags',
        // },
      ],
    },
  ];

  userMenuItems = [
    {
      label: 'Projects',
      icon: 'pi pi-building',
    },
  ];
}
