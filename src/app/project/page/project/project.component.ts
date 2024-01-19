import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { map } from 'rxjs';

import { ProjectOverviewDTO } from '../../dto/projectOverviewDTO';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  items: MenuItem[] = [
    {
      label: 'Übersicht',
      routerLink: './overview',
      icon: 'pi pi-info-circle',
      disabled: true,
    },
    {
      label: 'Personal',
      icon: 'pi pi-users',
      routerLink: './users',
    },
    {
      label: 'Zeitplan',
      routerLink: './schedule',
      icon: 'pi pi-calendar',
      disabled: true,
    },
    {
      label: 'Ressourcen',
      icon: 'pi pi-money-bill',
      disabled: true,
    },
    {
      label: 'Dokumente',
      icon: 'pi pi-folder-open',
      disabled: true,
    },
    {
      label: 'Neuigkeiten',
      icon: 'pi pi-comments',
      disabled: true,
    },
    {
      label: 'Aufgaben',
      routerLink: './tasks',
      icon: 'pi pi-check-circle',
    },
    {
      label: 'Einstellungen',
      routerLink: './settings',
      icon: 'pi pi-cog',
    },
  ];

  projectOverview$ = this.route?.data.pipe(map(data => data['overview'] as ProjectOverviewDTO));

  mapOptions = {
    controlSize: 25,
    mapTypeControl: false,
    keyboardShortcuts: false,
  } as google.maps.MapOptions;

  constructor(private readonly route: ActivatedRoute) {}
}
