import { Component, EventEmitter, Output } from '@angular/core';
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-cancel-save',
  templateUrl: './cancel-save.component.html',
  styleUrls: ['./cancel-save.component.scss'],
  standalone: true,
  imports: [
    ButtonModule
  ]
})
export class CancelSaveComponent {
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
}
