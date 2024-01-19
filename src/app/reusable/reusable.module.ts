import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { InputErrorDirective } from './directive/input-error.directive';
import { LetDirective } from './directive/let.directive';
import { InputErrorHintComponent } from './input-error-hint/input-error-hint.component';
import { ConcatArraysPipe } from './pipe/concat-arrays.pipe';
import { RemoveDuplicatesPipe } from './pipe/remove-duplicates.pipe';

@NgModule({
  imports: [CommonModule, ButtonModule, InputTextareaModule, InputTextModule, ReactiveFormsModule],
  declarations: [LetDirective, InputErrorDirective, InputErrorHintComponent, RemoveDuplicatesPipe, ConcatArraysPipe],
  exports: [LetDirective, InputErrorDirective, InputErrorHintComponent, RemoveDuplicatesPipe, ConcatArraysPipe],
})
export class ReusableModule {}
