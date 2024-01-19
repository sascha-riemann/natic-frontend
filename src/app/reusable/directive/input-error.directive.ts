import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appInputError]',
})
export class InputErrorDirective {
  constructor(private readonly el: ElementRef) {}

  private getElement(): HTMLElement {
    return this.el.nativeElement as HTMLElement;
  }

  @Input() set appInputError(appInputError: boolean) {
    if (appInputError) {
      this.getElement().classList.add('ng-invalid', 'ng-dirty');
    } else {
      this.getElement().classList.remove('ng-invalid', 'ng-dirty');
    }
  }
}
