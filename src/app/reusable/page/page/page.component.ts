import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  standalone: true,
  imports: [ButtonModule, RouterLink, NgClass, NgIf],
})
export class PageComponent {
  @Input() title!: string;
  @Input() showCreateButton = false;
  @Input() createRouterLink?: string;
  @Input() size: 'small' | 'normal' | 'bigger' | 'full' = 'normal';

  @Output() createClick = new EventEmitter<void>();
}
