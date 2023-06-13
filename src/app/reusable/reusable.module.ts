import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LetDirective } from './directive/let.directive';

@NgModule({
  declarations: [LetDirective],
  exports: [LetDirective],
  providers: [],
  imports: [CommonModule],
})
export class ReusableModule {}
