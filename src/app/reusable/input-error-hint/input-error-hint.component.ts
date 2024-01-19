import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-error-hint',
  templateUrl: './input-error-hint.component.html',
  styleUrls: ['./input-error-hint.component.scss'],
})
export class InputErrorHintComponent {
  @Input({ required: true }) errorMessage?: string;
}
